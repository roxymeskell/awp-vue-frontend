import { Chart, CategoryScale, CategoryScaleOptions, ChartArea } from 'chart.js'
import { merge } from 'chart.js/helpers'
import { getStyleForLabel, createImageForLabel } from '@/helpers/happinessStyleHelpers'
import { drawImageAt, drawGradientTab } from '@/helpers/drawHelpers'

interface ILabelNodeCol {
  width: number
  center: number
}

export interface ILabelNode {
  label: string
  center: number
  width: number
  col: ILabelNodeCol
  auxCol: ILabelNodeCol
  fullCol: ILabelNodeCol
}

export interface IInternalScale {
  _valueRange: number
  _startValue: number
  _startPixel: number
  _length: number
}

export interface IHappinessCategoryScaleOptions extends CategoryScaleOptions {
  category_padding: number // Padding on either side of categories
  column_width: number // Regular, "team" column width
  total_column_width: number // Total, "team" column width
  aux_column_width: number // Workplace column width
  aux_column_sep: number // Space between team columns and workplace columns

  offset: true
  labels: ['Very Happy + Happy', 'Very Happy', 'Happy', 'Content', 'Unhappy', 'Very Unhappy', 'Not Happy']
}

const defaultConfig: Partial<Omit<IHappinessCategoryScaleOptions, 'grid' | 'border' | 'ticks'>> & {
  grid: Partial<IHappinessCategoryScaleOptions['grid']>
  border: Partial<IHappinessCategoryScaleOptions['border']>
  ticks: Partial<IHappinessCategoryScaleOptions['ticks']>
} = {
  offset: true,
  position: 'top',
  labels: ['Very Happy + Happy', 'Very Happy', 'Happy', 'Content', 'Unhappy', 'Very Unhappy', 'Not Happy'],
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
      return getStyleForLabel(context.tick.label as string).labelFont.color
    },
    font: (context) => {
      return {
        weight: 'bold',
        family: 'Roboto',
        ...getStyleForLabel(context.tick.label as string).labelFont,
      }
    },
  },
  category_padding: 20,
  column_width: 45,
  total_column_width: 150, // 70,
  aux_column_width: 24,
  aux_column_sep: 16,
}

export default class HappinessCategoryScale extends CategoryScale<IHappinessCategoryScaleOptions> {
  static override id = 'happiness-category'
  static defaults: any = /*! __PURE__ */ merge({}, [CategoryScale.defaults, defaultConfig])

  private _nodes: any[] = []
  private _factor: number = 1
  private _totalWidth: number = 0

  _drawLabelFor(ctx: CanvasRenderingContext2D, paddingTop: number, label: string) {
    const image = createImageForLabel(label)
    const style = getStyleForLabel(label)
    const center = this.getPixelForValue(label)
    const width =
      label === 'Very Happy + Happy' || label === 'Not Happy'
        ? 120 * this._factor
        : this.getPixelForValue(label + '.width')
    drawImageAt(ctx, image, Math.min(76, width, paddingTop), this.getPixelForValue(label), paddingTop - 8)
    drawGradientTab(ctx, style.tab.gradient.start, style.tab.gradient.end, center, width, paddingTop)

    ctx.font = style.tab.font
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(style.tab.text, center, paddingTop - 25 / 2, width)
  }

  _drawGridlines() {
    // Drawing gridlines
    const chart = this.chart
    const ctx = this.ctx
    const bottom = chart.scales.y.bottom

    const { borderColor = '#BABEC4', layout: { padding: { top: paddingTop = 0 } = {} } = {} } = chart.options as any
    const {
      canvas: { height: canvasHeight },
    } = chart
    const top = 0 + paddingTop
    const height = canvasHeight - paddingTop

    const drawLine = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      ctx.save()
      ctx.lineWidth = 1
      ctx.strokeStyle = borderColor

      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
      ctx.restore()
    }

    let x = this.getPixelForValue('Very Happy + Happy.center') + this.getPixelForValue('Very Happy + Happy.width') / 2
    drawLine({ x: x, y: top }, { x: x, y: top + height })

    x = this.getPixelForValue('Happy.center') + this.getPixelForValue('Happy.width') / 2
    drawLine({ x: x, y: top }, { x: x, y: bottom })

    x = this.getPixelForValue('Very Unhappy.center') + this.getPixelForValue('Very Unhappy.width') / 2
    drawLine({ x: x, y: top }, { x: x, y: top + height })
  }

  _drawBorder() {
    const chart = this.chart
    const ctx = this.ctx

    const { borderColor = '#BABEC4', layout: { padding: { top: paddingTop = 0 } = {} } = {} } = chart.options as any
    const {
      canvas: { height: canvasHeight },
      chartArea: { left, width },
    } = chart
    const top = 0 + paddingTop
    const height = canvasHeight - paddingTop

    ctx.save()
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 1

    const region = new Path2D()
    region.roundRect(left, top, width, height, 8)

    ctx.stroke(region)
    ctx.restore()
  }

  _beforeDraw(chart: Chart) {
    const { layout: { padding: { top: paddingTop = 0 } = {} } = {} } = chart.options as any
    const {
      ctx,
      chartArea: { left, width },
    } = chart
    ctx.save()

    const region = new Path2D()
    region.rect(left, 0, width, paddingTop)
    ctx.clip(region, 'evenodd')

    ctx.font = 'bold 14px Roboto'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    this.getLabels().forEach((l) => this._drawLabelFor(ctx, paddingTop, l))

    ctx.stroke()
    ctx.restore()

    this._drawGridlines()
    this._drawBorder()
  }

  draw(chartArea: ChartArea) {
    this._beforeDraw(this.chart)
    super.draw(chartArea)
  }

  determineDataLimits(): void {
    const labels = this.getLabels()

    // labels are already prepared by the plugin just use them as ticks
    this._nodes = labels.map((l) => {
      return {
        label: l,
        center: Number.NaN,
        width: 0,
      }
    }) as unknown as ILabelNode[]

    super.determineDataLimits()
  }

  configure(): void {
    super.configure()
    const nodes = this._nodes.slice(this.min, this.max + 1)
    const total = (this as unknown as IInternalScale)._length

    if (nodes.length === 0) {
      return
    }
    this._totalWidth =
      this.options.category_padding * 14 +
      this.options.aux_column_width * 7 +
      this.options.aux_column_sep * 7 +
      this.options.column_width * 5 +
      this.options.total_column_width * 2
    this._factor = total / this._totalWidth

    let offset =
      ((this.options.category_padding * 2 +
        this.options.aux_column_width +
        this.options.aux_column_sep +
        this.options.total_column_width) *
        this._factor) /
      2
    nodes.forEach((node, i) => {
      const width =
        (this.options.category_padding * 2 +
          this.options.aux_column_width +
          this.options.aux_column_sep +
          (i === 0 || i === 6 ? this.options.total_column_width : this.options.column_width)) *
        this._factor
      const nextWidth =
        (this.options.category_padding * 2 +
          this.options.aux_column_width +
          this.options.aux_column_sep +
          (i + 1 === 0 || i + 1 === 6 ? this.options.total_column_width : this.options.column_width)) *
        this._factor

      // eslint-disable-next-line no-param-reassign
      node.center = offset
      offset += width / 2 + nextWidth / 2

      // eslint-disable-next-line no-param-reassign
      node.width = width

      node.fullCol = {
        width:
          (this.options.aux_column_width +
            this.options.aux_column_sep +
            (i === 0 || i === 6 ? this.options.total_column_width : this.options.column_width)) *
          this._factor,
        center: node.center,
      }
      node.col = {
        width: (i === 0 || i === 6 ? this.options.total_column_width : this.options.column_width) * this._factor,
        center:
          node.center -
          node.fullCol.width / 2 +
          ((i === 0 || i === 6 ? this.options.total_column_width : this.options.column_width) * this._factor) / 2,
      }
      node.auxCol = {
        width: this.options.aux_column_width * this._factor,
        center: node.center + node.fullCol.width / 2 - (this.options.aux_column_width * this._factor) / 2,
      }
    })
  }

  public override getLabels(): string[] {
    return ['Very Happy + Happy', 'Very Happy', 'Happy', 'Content', 'Unhappy', 'Very Unhappy', 'Not Happy']
  }

  public override parse(raw: string, index?: number) {
    if (raw === null || raw === undefined) {
      return null
    }
    if (!Number.isNaN(parseInt(raw))) {
      return parseInt(raw)
    }
    return super.parse(raw, index) as number
  }

  getPixelForValue(value: number | string, index?: number | undefined | null): number {
    if (typeof value === 'number') {
      index = value
      return this._centerBase(index)
    }

    // If not number, assume label with possible modifiers
    // [label].[col|auxCol|fullCol|center|width].[center|width]
    const valueParts = (value as string).split('.')
    valueParts[0]
    index = this.parse(valueParts[0])
    if (index === null) {
      return NaN
    }
    let node: ILabelNode | ILabelNodeCol = this._nodes[index as number]
    if (node == null) {
      return NaN
    }

    for (let i = 1; i < 3; i++) {
      switch (valueParts[i]) {
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

    return NaN
  }

  getPixelForDecimal(value: number): number {
    const index = Math.min(Math.floor(value * this._nodes.length), this._nodes.length - 1)

    if (index === 1 && this._nodes.length === 1) {
      // corner case in chartjs to determine tick width, hard coded 1
      return this._nodes[0].width
    }
    return this._centerBase(index)
  }

  /**
   * @hidden
   */
  _centerNodeCol(node: ILabelNode | ILabelNodeCol | null | undefined): number {
    const centerTick = this.options.offset
    const base = (this as unknown as IInternalScale)._startPixel

    if (!node) {
      return base
    }

    const nodeCenter = node.center != null ? node.center : 0
    const nodeWidth = node.width != null ? node.width : 0
    return base + nodeCenter - (centerTick ? 0 : nodeWidth / 2)
  }

  /**
   * @hidden
   */
  _centerBase(index: number): number {
    const centerTick = this.options.offset
    const base = (this as unknown as IInternalScale)._startPixel
    const node = this._nodes[index]

    if (node == null) {
      return base
    }

    const nodeCenter = node.center != null ? node.center : 0
    const nodeWidth = node.width != null ? node.width : 0
    return base + nodeCenter - (centerTick ? 0 : nodeWidth / 2)
  }

  _centerCol(index: number): number {
    const centerTick = this.options.offset
    const base = (this as unknown as IInternalScale)._startPixel
    const node = this._nodes[index]

    if (node == null) {
      return base
    }

    const nodeCenter = node.col != null ? node.col.center : 0
    const nodeWidth = node.col != null ? node.col.width : 0
    return base + nodeCenter - (centerTick ? 0 : nodeWidth / 2)
  }

  _centerAuxCol(index: number): number {
    const centerTick = this.options.offset
    const base = (this as unknown as IInternalScale)._startPixel
    const node = this._nodes[index]

    if (node == null) {
      return base
    }

    const nodeCenter = node.auxCol != null ? node.auxCol.center : 0
    const nodeWidth = node.auxCol != null ? node.auxCol.width : 0
    return base + nodeCenter - (centerTick ? 0 : nodeWidth / 2)
  }

  _centerFullCol(index: number): number {
    const centerTick = this.options.offset
    const base = (this as unknown as IInternalScale)._startPixel
    const node = this._nodes[index]

    if (node == null) {
      return base
    }

    const nodeCenter = node.fullCol != null ? node.fullCol.center : 0
    const nodeWidth = node.fullCol != null ? node.fullCol.width : 0
    return base + nodeCenter - (centerTick ? 0 : nodeWidth / 2)
  }
}
