import { Chart, CategoryScale, CategoryScaleOptions, registry } from 'chart.js';
import { merge } from 'chart.js/helpers';
import { getStyleForLabel, createImageForLabel } from '../../happinessStyleHelpers';

function drawImageAt(ctx, image, size: number, x: number) {
  const { width: oWidth = size, height: oHeight = size } = image;
  const width = oWidth * size / oHeight, height = oHeight * size / oWidth;
  // image, dx, dy, width, height
  ctx.drawImage(image, x - size / 2, size - height, size, height);
  // image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
  // ctx.drawImage(image, 0, size - height, size, height, x - size / 2, 0, size, size)
}

function drawGradientTab(ctx, startColor, stopColor, x, width = 120, y = 0) {
  const height = 25;
  // const gradient = ctx.createLinearGradient(0, y, 0, y + height);
  const gradient = ctx.createLinearGradient(0, y - height, 0, y + height);
  gradient.addColorStop(0, stopColor);
  gradient.addColorStop(0.5, startColor);
  ctx.fillStyle = gradient;

  let region = new Path2D();
  region.roundRect(x - width / 2, y - height, width, height * 2, 16);
  ctx.fill(region);

  // ctx.fillRect(10, 10, 150, 80);
}

function drawLabelFor(ctx, scale, topPadding, label, factor = 1) {
  const image = createImageForLabel(label);
  const style = getStyleForLabel(label);
  const center = scale.getPixelForValue(label)
  console.log('Label For', label, image, style)
  drawImageAt(ctx, image, 76, scale.getPixelForValue(label));
  drawGradientTab(
    ctx,
    style.gradientStart,
    style.gradientEnd,
    center,
    label === 'Very Happy + Happy' || label === 'Not Happy'
      ? 120 * factor
      : scale.getPixelForValue(label + '.width'),
    topPadding
  );

  ctx.font = style.tab.font
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(style.tab.text, center, topPadding - (25 / 2))

  // ctx.save()
}


function chartLabelsBeforeDraw(chart: Chart, args, options) {
    const { layout: { padding: { top: paddingTop = 0 } = {} } = {} } =
      chart.options as any;
    const {
      ctx,
      canvas: { height: canvasHeight },
      chartArea: { left, width }, // top, height
    } = chart;
    const top = 0 + paddingTop;
    const height = canvasHeight - paddingTop;
    ctx.save();

    // ctx.beginPath();
    // ctx.arc(100, 75, 50, 0, Math.PI * 2);
    // ctx.rect(left, 0, width, paddingTop);
    // ctx.clip();

    let region = new Path2D();
    region.rect(left, 0, width, paddingTop);
    ctx.clip(region, 'evenodd');

    console.log('happiness label', args, chart);

    const scale = chart.scales.x;
    const factor = 1; // 7 / (scale.getPixelForValue('Not Happy') + scale.getPixelForValue('Not Happy.width')/2);

    ctx.font = 'bold 14px Roboto'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    drawLabelFor(ctx, scale, paddingTop, 'Very Happy + Happy', factor);
    drawLabelFor(ctx, scale, paddingTop, 'Very Happy', factor);
    drawLabelFor(ctx, scale, paddingTop, 'Happy', factor);
    drawLabelFor(ctx, scale, paddingTop, 'Content', factor);
    drawLabelFor(ctx, scale, paddingTop, 'Unhappy', factor);
    drawLabelFor(ctx, scale, paddingTop, 'Very Unhappy', factor);
    drawLabelFor(ctx, scale, paddingTop, 'Not Happy', factor);
    console.log('Finished drawing labels')

    ctx.stroke();
    ctx.restore();
}


interface ILabelNodeCol {
  width: number;
  center: number;
}

export interface ILabelNode {
  label: string;
  center: number;
  width: number;
  col: ILabelNodeCol;
  auxCol: ILabelNodeCol;
  fullCol: ILabelNodeCol;
}

export interface IInternalScale {
  _valueRange: number;
  _startValue: number;
  _startPixel: number;
  _length: number;
}

export interface IHappinessCategoryScaleOptions extends CategoryScaleOptions {
  category_padding: number; // Padding on either side of categories
  column_width: number; // Regular, "team" column width
  total_column_width: number; // Total, "team" column width
  aux_column_width: number; // Workplace column width
  aux_column_sep: number; // Space between team columns and workplace columns

  offset: true;
  labels: [
    'Very Happy + Happy',
    'Very Happy',
    'Happy',
    'Content',
    'Unhappy',
    'Very Unhappy',
    'Not Happy'
  ];
}

const defaultConfig: Partial<Omit<IHappinessCategoryScaleOptions, 'grid' | 'border' | 'ticks'>> & {
  grid: Partial<IHappinessCategoryScaleOptions['grid']>;
  border: Partial<IHappinessCategoryScaleOptions['border']>;
  ticks: Partial<IHappinessCategoryScaleOptions['ticks']>;
} = {
  // offset settings, for centering the categorical axis in the bar chart case
  offset: true,
  position: 'top',
  labels: [
    'Very Happy + Happy',
    'Very Happy',
    'Happy',
    'Content',
    'Unhappy',
    'Very Unhappy',
    'Not Happy',
  ],
  // gridLines: {
  //   display: false,
  // },
  // barPercentage: 1,
  // categoryPercentage: 1,
  border: {
    display: false,
  },
  grid: {
    offset: true,
    display: true,
    drawOnChartArea: false,
    drawTicks: false,
  },
  ticks: {
    color: (context) => {
      return getStyleForLabel(context.tick.label).labelFont.color
    },
    font: (context) => {
      return {
        weight: 'bold',
        family: 'Roboto',
        ...getStyleForLabel(context.tick.label).labelFont
      };
    },
  },
  category_padding: 20,
  column_width: 45,
  total_column_width: 150, // 70,
  aux_column_width: 24,
  aux_column_sep: 16,
};

export class HappinessCategoryScale extends CategoryScale<IHappinessCategoryScaleOptions> {
  static override id = 'happiness-category';
  static defaults: any = /*! __PURE__ */ merge({}, [
    CategoryScale.defaults,
    defaultConfig,
  ]);

  private _nodes: any[] = [];
  _factor: number
  _totalWidth: number

  // Register plugins after register
  static afterRegister(): void {
    // registry.addPlugins(HappinessLabelPlugin);
    registry.addPlugins({
      id: 'happiness-label-plugin',
      beforeDraw: chartLabelsBeforeDraw.bind(this),
    })
  }

  determineDataLimits(): void {
    const labels = this.getLabels();

    // labels are already prepared by the plugin just use them as ticks
    this._nodes = labels.map((l) => {
      return {
        label: l,
        center: Number.NaN,
        width: 0,
      };
    }) as unknown as ILabelNode[];

    super.determineDataLimits();
  }

  configure(): void {
    super.configure();
    const nodes = this._nodes.slice(this.min, this.max + 1);
    const total = (this as unknown as IInternalScale)._length;

    if (nodes.length === 0) {
      return;
    }
    this._totalWidth =
      this.options.category_padding * 14 +
      this.options.aux_column_width * 7 +
      this.options.aux_column_sep * 7 +
      this.options.column_width * 5 +
      this.options.total_column_width * 2;
    this._factor = total / this._totalWidth;

    let offset =
      ((this.options.category_padding * 2 +
        this.options.aux_column_width +
        this.options.aux_column_sep +
        this.options.total_column_width) *
        this._factor) /
      2;
    nodes.forEach((node, i) => {
      const width =
        (this.options.category_padding * 2 +
          this.options.aux_column_width +
          this.options.aux_column_sep +
          (i === 0 || i === 6
            ? this.options.total_column_width
            : this.options.column_width)) *
        this._factor;
      const nextWidth =
        (this.options.category_padding * 2 +
          this.options.aux_column_width +
          this.options.aux_column_sep +
          (i + 1 === 0 || i + 1 === 6
            ? this.options.total_column_width
            : this.options.column_width)) *
        this._factor;

      // eslint-disable-next-line no-param-reassign
      node.center = offset;
      offset += width / 2 + nextWidth / 2;

      // eslint-disable-next-line no-param-reassign
      node.width = width;

      node.fullCol = {
        width: (this.options.aux_column_width +
            this.options.aux_column_sep +
            (i === 0 || i === 6
              ? this.options.total_column_width
              : this.options.column_width)) *
          this._factor,
        center: node.center
      }
      node.col = {
        width: (i === 0 || i === 6
          ? this.options.total_column_width
          : this.options.column_width) * this._factor,
        center: node.center - node.fullCol.width / 2 + ((i === 0 || i === 6
          ? this.options.total_column_width
          : this.options.column_width) * this._factor) / 2
      }
      node.auxCol = {
        width: this.options.aux_column_width * this._factor,
        center: node.center + node.fullCol.width / 2 - (this.options.aux_column_width * this._factor) / 2
      }
    });
  }

  public override getLabels(): string[] {
    const data = this.chart.data;
    return [
      'Very Happy + Happy',
      'Very Happy',
      'Happy',
      'Content',
      'Unhappy',
      'Very Unhappy',
      'Not Happy',
    ];
  }

  public override parse(raw: string, index?) {
    if (raw === null || raw === undefined) {
      return null;
    }
    if (!Number.isNaN(parseInt(raw))) {
        return parseInt(raw)
    }
    return super.parse(raw, index) as number;
    const labels = super.getLabels();
    if (!isFinite(index) || labels[index] !== raw) {
      let _index = index === undefined ? raw : index;
      const first = labels.indexOf(raw);
      if (first === -1) {
        if (typeof raw === 'string') {
          _index = labels.push(raw) - 1;
          this._addedLabels.unshift({ index: _index, label: raw });
        } else if (isNaN(raw)) {
          _index = null;
        }
        index = _index;
      }
      const last = labels.lastIndexOf(raw);
      index = first !== last ? _index : first;
    }
    return index === null
      ? null
      : Math.max(0, Math.min(labels.length - 1, Math.round(index)));
  }

  _parseValueStr(value: string) {
    const centerTick = this.options.offset;
    const base = (this as unknown as IInternalScale)._startPixel;

    let valueParts = (value as string).split('.')
    let index = this.parse(valueParts[0])
    if (index === null) {
        return NaN;
    }
    let node: ILabelNode | ILabelNodeCol= this._nodes[index as number];
    if (node == null) {
        return NaN;
    }

    for (let i = 1; i < 3; i++) {
        switch(valueParts[i]) {
            case null:
            case 'center':
                return this._centerNodeCol(node)
            case 'width':
                return node.width
            case 'col':
                node = (node as ILabelNode).col
                continue
            case 'auxCol':
                node = (node as ILabelNode).auxCol
                continue
            case 'fullCol':
                node = (node as ILabelNode).fullCol
                continue
        }
    }

  }

  getPixelForValue(value: number | string, index?: number | undefined | null): number {
    if (typeof value === 'number') {
      index = value
      return this._centerBase(index)
    }

    // If not number, assume label with possible modifiers
    // [label].[col|auxCol|fullCol|center|width].[center|width]
    let valueParts = (value as string).split('.')
    valueParts[0]
    index = this.parse(valueParts[0])
    if (index === null) {
        return NaN;
    }
    let node: ILabelNode | ILabelNodeCol = this._nodes[index as number];
    if (node == null) {
        return NaN;
    }

    for (let i = 1; i < 3; i++) {
        switch(valueParts[i]) {
            case undefined:
            case null:
            case 'center':
                return this._centerNodeCol(node)
            case 'width':
                return node.width
            case 'col':
                node = (node as ILabelNode).col
                continue
            case 'auxCol':
                node = (node as ILabelNode).auxCol
                continue
            case 'fullCol':
                node = (node as ILabelNode).fullCol
                continue
        }
    }

    return NaN;
  }

  getPixelForDecimal(value: number): number {
    const index = Math.min(
      Math.floor(value * this._nodes.length),
      this._nodes.length - 1
    );

    if (index === 1 && this._nodes.length === 1) {
      // corner case in chartjs to determine tick width, hard coded 1
      return this._nodes[0].width;
    }
    console.log('getPixelForDecimal', {
      value,
      old: super.getDecimalForPixel(value),
      new: this._centerBase(index),
    });
    return this._centerBase(index);
  }

  /**
   * @hidden
   */
  _centerNodeCol(node: ILabelNode | ILabelNodeCol | null | undefined): number {
    const centerTick = this.options.offset;
    const base = (this as unknown as IInternalScale)._startPixel;

    if (!node) {
      return base;
    }

    const nodeCenter = node.center != null ? node.center : 0;
    const nodeWidth = node.width != null ? node.width : 0;
    return base + nodeCenter - (centerTick ? 0 : nodeWidth / 2);
  }

  /**
   * @hidden
   */
  _centerBase(index: number): number {
    const centerTick = this.options.offset;
    const base = (this as unknown as IInternalScale)._startPixel;
    const node = this._nodes[index];

    if (node == null) {
      return base;
    }

    const nodeCenter = node.center != null ? node.center : 0;
    const nodeWidth = node.width != null ? node.width : 0;
    return base + nodeCenter - (centerTick ? 0 : nodeWidth / 2);
  }

  _centerCol(index: number): number {
    const centerTick = this.options.offset;
    const base = (this as unknown as IInternalScale)._startPixel;
    const node = this._nodes[index];

    if (node == null) {
      return base;
    }

    const nodeCenter = node.col != null ? node.col.center : 0;
    const nodeWidth = node.col != null ? node.col.width : 0;
    return base + nodeCenter - (centerTick ? 0 : nodeWidth / 2);
  }

  _centerAuxCol(index: number): number {
    const centerTick = this.options.offset;
    const base = (this as unknown as IInternalScale)._startPixel;
    const node = this._nodes[index];

    if (node == null) {
      return base;
    }

    const nodeCenter = node.auxCol != null ? node.auxCol.center : 0;
    const nodeWidth = node.auxCol != null ? node.auxCol.width : 0;
    return base + nodeCenter - (centerTick ? 0 : nodeWidth / 2);
  }

  _centerFullCol(index: number): number {
    const centerTick = this.options.offset;
    const base = (this as unknown as IInternalScale)._startPixel;
    const node = this._nodes[index];

    if (node == null) {
      return base;
    }

    const nodeCenter = node.fullCol != null ? node.fullCol.center : 0;
    const nodeWidth = node.fullCol != null ? node.fullCol.width : 0;
    return base + nodeCenter - (centerTick ? 0 : nodeWidth / 2);
  }
}
