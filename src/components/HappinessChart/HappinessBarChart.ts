import { createTypedChart } from 'vue-chartjs';
import {
  BarController,
  BarControllerChartOptions,
  Chart,
  Scale,
  registry,
  Title,
  BarElement,
  LinearScale,
  ChartData,
} from 'chart.js';
import { HappinessCategoryScale } from './happinessCategoryScale';

import amazingImgUrl from '../../assets/Amazing-Face.svg';
import goodImgUrl from '../../assets/Good-Face.svg';
import okayImgUrl from '../../assets/Okay-Face.svg';
import riskImgUrl from '../../assets/Risk-Face.svg';
import highRiskImgUrl from '../../assets/High-Risk-Face.svg';

class HappinessBarController extends BarController {
  static override id = 'happiness-bar';

  static override defaults = {
    datasetElementType: false,
    dataElementType: 'bar',

    categoryPercentage: 1,
    barPercentage: 0.9,
    grouped: true,

    animations: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'base', 'width', 'height'],
      },
    },

    borderRadius: 8,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Foo',
        },
        ticks: {
          stepSize: 0.25,
          callback: (value) => `${value * 100}%`,
        },
        // type: 'percent',
        position: 'left', // `axis` is determined by the position as `'y'`
        min: 0,
        max: 1,
      },
      /*x: {
        type: 'category',
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
        gridLines: {
          display: false,
        },
        barPercentage: 1,
        categoryPercentage: 1,
      },*/
      x: { type: 'customScale', total_column_width: 2000 },
    },
    layout: { padding: { bottom: 50, top: 76 } }
  };

  static overrides = {
    categoryPercentage: 1,
    borderRadius: 8,
    // layout: {
    //   padding: {
    //     bottom: 50, top: 76
    //     // bottom: 2000, top: 10
    //   },
    // },
    scales: {
      _index_: { type: 'customScale', total_column_width: 70 },
      _value_: {
        type: 'linear',
        beginAtZero: true,
        ticks: {
          stepSize: 0.25,
          callback: (value) => `${value * 100}%`,
          color: '#8B929C',
          font: { family: 'Roboto', size: 16 },
        },
        position: 'left',
        min: 0,
        max: 1,
        drawTicks: false,
      },
    },
  };

  static afterRegister(): void {
    registry.addScales(HappinessCategoryScale);
    // registry.addPlugins(HappinessCategoryScale);
  }

  _drawVerticalLine(x: number = 0, color: string = '#FF0000') {
    const ctx = this.chart.ctx;
    // const x = 304.04009262921943; //this.chart.tooltip.x;
    const topY = this.chart.scales.y.top;
    const bottomY = this.chart.scales.y.bottom;

    // draw line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, topY);
    ctx.lineTo(x, bottomY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
  }

  _computeFlexCategoryTraits(index, ruler, options, stackCount) {
    const pixels = ruler.pixels;
    const curr = pixels[index];
    let prev = index > 0 ? pixels[index - 1] : null;
    let next = index < pixels.length - 1 ? pixels[index + 1] : null;
    const percent = options.categoryPercentage;

    if (prev === null) {
      // first data: its size is double based on the next point or,
      // if it's also the last data, we use the scale size.
      prev = curr - (next === null ? ruler.end - ruler.start : next - curr);

      //  size = (Math.abs(next - (curr - (next - curr))) / 2) * percent;
      //  size = (Math.abs(next - (curr - next + curr)) / 2) * percent;
      //  size = (Math.abs(next - (2*curr - next)) / 2) * percent;
      //  size = (Math.abs(next + (next - 2*curr)) / 2) * percent;
      //  size = (Math.abs(2*next - 2*curr)) / 2) * percent;
      //  size = Math.abs(next - curr) * percent;

      // start = curr - ((curr - Math.min(curr - (next - curr), next)) / 2) * percent;
      // start = curr - ((curr - Math.min(2*curr - next, next)) / 2) * percent;
      // start = curr - (curr/2 - Math.min(2*curr - next, next)/2) * percent;
      // start = curr - (curr*percent/2 - Math.min(2*curr - next, next)*percent/2);
      // start = curr - curr*percent/2 + Math.min(2*curr - next, next)*percent/2;
    }

    if (next === null) {
      // last data: its size is also double based on the previous point.
      next = curr + curr - prev;
    }

    if (index == 0) {
      this._drawVerticalLine(prev, '#00FF00');
      this._drawVerticalLine(next, '#00FF00');
      this._drawVerticalLine(curr, '#00FF00');
    }

    // const start = curr - ((curr - Math.min(prev, next)) / 2) * percent;
    const size = (Math.abs(next - prev) / 2) * percent;
    //  (Math.abs(next - (curr - (next - curr))) / 2) * percent;
    const start =
      ruler.scale._nodes[index].center - ruler.scale._nodes[index].width / 2;
    // const size = (ruler.scale._nodes[index].width / 2) * percent;

    console.log('computeFlexCataegoryTraits', {
      ruler,
      curr,
      prev,
      next,
      chunk: size / stackCount,
      ratio: options.barPercentage,
      scaleStartPixel: ruler.scale._startPixel,
      start,
      size,
      start_if_first:
        curr -
        (curr * percent) / 2 +
        (Math.min(2 * curr - next, next) * percent) / 2, // (next / 2) * percent,
      size_if_first: Math.abs(next - curr) * percent,
      node: ruler.scale._nodes[index],
    });

    return {
      chunk: size / stackCount,
      ratio: options.barPercentage,
      start,
      size,
    };
  }

  public _calculateBarValuePixels(index, ruler) {
    return super._calculateBarValuePixels(index, ruler)
  }


  public _calculateBarIndexPixels(index, ruler) {
    const scale = ruler.scale;
    const options = this.options;
    const skipNull = options.skipNull;
    const maxBarThickness = Infinity; // valueOrDefault(options.maxBarThickness, Infinity);
    let center, size;
    if (ruler.grouped) {
      const stackCount = skipNull
        ? this._getStackCount(index)
        : ruler.stackCount;

      const stackIndex = this._getStackIndex(
        this.index,
        this._cachedMeta.stack,
        skipNull ? index : undefined
      );

      // Chunks:
      // 0: team column
      // 1: workplace column
      if (stackCount > 1) {
        if (stackIndex === 0) {
          size = scale.getPixelForValue(index + '.col.width') // iScale._nodes[index].colWidth;
          center = scale.getPixelForValue(index + '.col.center')  // iScale._startPixel + iScale._nodes[index].colCenter;
        } else {
          size = scale.getPixelForValue(index + '.auxCol.width') // iScale._nodes[index].auxColWidth;
          center = scale.getPixelForValue(index + '.auxCol.center') // iScale._startPixel + iScale._nodes[index].auxColCenter;
        }
      } else {
        // For bar charts with only one stack, exact full column values are used
        center = scale.getPixelForValue(index + '.fullCol.center');
        size = scale.getPixelForValue(index + '.fullCol.width');
      }
    } else {
      // For non-grouped bar charts, exact full column values are used
      center = scale.getPixelForValue(index + '.fullCol.center');
      size = scale.getPixelForValue(index + '.fullCol.width');
    }

    return {
      base: center - size / 2,
      head: center + size / 2,
      center,
      size,
    };
  }

  public override updateElement(element, index, properties, mode) {
    console.log(element, index, properties, mode);
    super.updateElement(element, index, properties, mode);
  }

  _drawChartOutline() {
    const chart = this.chart as Chart;
    const options = chart.options; // (this as any).options;
    const { layout: { padding: { top: paddingTop = 0 } = {} } = {} } = options as any;
    const {
      ctx,
      canvas: { height: canvasHeight },
      chartArea: { left, width }, // top, height
    } = chart;
    const top = 0 + paddingTop;
    const height = canvasHeight - paddingTop;

    ctx.save();
    ctx.strokeStyle = '#ff0000' // '#BABEC4'; // ((options as any).borderColor || '#BABEC4') as string;
    ctx.lineWidth = 1; // ((options as any).borderWidth || 1) as number;
    // ctx.setLineDash(options.borderDash || []);
    // ctx.lineDashOffset = options.borderDashOffset;
    // ctx.strokeRect(left, top, width, height);
    // ctx.roundRect(left, top, width, height, options.borderRadius || 0);
    ctx.roundRect(
      left,
      top,
      width,
      height, // chart.canvas.height,
      8, // options.borderRadius || 8
    );
    // ctx.stroke();

    console.log('Drawing border', left, top, width, height, ctx.strokeStyle, ctx.lineWidth)

    const scale = this._cachedMeta.iScale as any

    const scaleBottom = this.chart.scales.y.bottom
    const canvasTop = 0 + paddingTop;
    const canvasBottom = this.chart.canvas.height
    let x = scale.getPixelForValue('Very Happy + Happy.center') +
    scale.getPixelForValue('Very Happy + Happy.width') / 2;
    ctx.moveTo(x, canvasTop);
    ctx.lineTo(x, canvasBottom);

    x = scale.getPixelForValue('Happy.center') +
    scale.getPixelForValue('Happy.width') / 2;
    ctx.moveTo(x, canvasTop);
    ctx.lineTo(x, scaleBottom);

    x = scale.getPixelForValue('Very Unhappy.center') +
    scale.getPixelForValue('Very Unhappy.width') / 2;
    ctx.moveTo(x, canvasTop);
    ctx.lineTo(x, canvasBottom);

    ctx.stroke();
    ctx.restore();
  }

  public override draw() {
    // this._drawChartOutline();
    super.draw();
    // this._drawChartOutline();

    console.log('drawing', this.chart, this.chart.ctx)
    const ctx = this.chart.ctx
    // const 
    const image = new Image()
    image.src = amazingImgUrl
    ctx.drawImage(image, 38, 38, 76, 76)

    const meta = this.getMeta();
    const pt0 = meta.data[0];
    // console.log(
    //   'Custom chart',
    //   this.getMeta(),
    //   this.getDataset(),
    //   this.getLabelAndValue(1)
    // );

    // const { x, y } = pt0.getProps(['x', 'y']);
    // const { radius } = pt0.options;

    // const ctx = this.chart.ctx;
    // ctx.save();
    // ctx.strokeStyle = 'red';
    // ctx.lineWidth = 1;
    // ctx.strokeRect(x - radius, y - radius, 2 * radius, 2 * radius);
    // ctx.restore();

    // // DRAW GRID
    // const scale = this._cachedMeta.iScale as any
    // const ctx = this.chart.ctx
    // const scaleBottom = this.chart.scales.y.bottom
    // const canvasTop = 0
    // const canvasBottom = this.chart.canvas.height
    // let x = scale.getPixelForValue('Very Happy + Happy.center') +
    // scale.getPixelForValue('Very Happy + Happy.width') / 2;
    // ctx.save();
    // ctx.beginPath();
    // ctx.moveTo(x, canvasTop);
    // ctx.lineTo(x, canvasBottom);

    // x = scale.getPixelForValue('Happy.center') +
    // scale.getPixelForValue('Happy.width') / 2;
    // ctx.moveTo(x, canvasTop);
    // ctx.lineTo(x, scaleBottom);

    // x = scale.getPixelForValue('Very Unhappy.center') +
    // scale.getPixelForValue('Very Unhappy.width') / 2;
    // ctx.moveTo(x, canvasTop);
    // ctx.lineTo(x, canvasBottom);
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = '#BABEC4';
    // ctx.stroke();
    // ctx.restore();
    

    // const ruler = this._getRuler();
    // console.log(ruler.pixels);

    // // // if (this.chart?.tooltip && this.chart.tooltip.opacity > 0) {
    
    // // const x = 304.04009262921943; //this.chart.tooltip.x;
    // const topY = this.chart.scales.y.top;
    // const bottomY = this.chart.scales.y.bottom;

    // for (let i = 0; i < ruler.pixels.length; i++) {
    //   this._drawVerticalLine(ruler.pixels[i], '#FF0000');
    // }

    // let node;
    // for (let i = 0; i < ruler.scale._nodes.length && i < 1; i++) {
    //   node = ruler.scale._nodes[i];
    //   // this._drawVerticalLine(ruler.scale._centerBase(i), '#005500');
    //   this._drawVerticalLine(ruler.scale._centerCol(i), '#00FF00');

    //   this._drawVerticalLine(ruler.scale._centerBase(i) - node.width / 2 - 1, '#000055');
    //   this._drawVerticalLine(ruler.scale._centerBase(i) + node.width / 2 + 1, '#0000FF');
    // }

    // for (let i = 0; i < ruler.scale._nodes.length && i < 1; i++) {
    //   // node = ruler.scale._centerCol(i)
    //   this._drawVerticalLine(ruler.scale._centerCol(i), '#005500');
    //   // this._drawVerticalLine(node.colCenter, '#00FF00');

    //   // this._drawVerticalLine(node.center - node.width / 2 - 1, '#000055');
    //   // this._drawVerticalLine(node.center + node.width / 2 + 1, '#0000FF');
    // }


    // // draw line
    // ctx.save();
    // ctx.beginPath();
    // ctx.moveTo(ruler.pixels[0], topY);
    // ctx.lineTo(ruler.pixels[0], bottomY);
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = '#FF0000';
    // ctx.stroke();
    // ctx.restore();
    // //}
  }
}
HappinessBarController.defaults = BarController.defaults;

const HappinessBarChart = createTypedChart(
  'happiness-bar' as 'bar',
  // 'bar',
  HappinessBarController
);

export default HappinessBarChart;
