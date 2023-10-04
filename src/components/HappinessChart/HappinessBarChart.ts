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
import { merge } from 'chart.js/helpers';
import { HappinessCategoryScale } from './happinessCategoryScale';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { datalabelsConfig } from '../../happinessStyleHelpers';

const defaultConfig = {
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
};

class HappinessBarController extends BarController {
  static override id = 'happiness-bar';

  static defaults: any = /*! __PURE__ */ merge({}, [
    BarController.defaults,
    defaultConfig,
  ]);

  static overrides = {
    responsive: true, maintainAspectRatio: false,
    layout: { padding: { bottom: 50, top: 84 } },
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
    plugins: {
      chartAreaBorder: {
        borderColor: '#BABEC4',
        borderWidth: 1,
        borderRadius: 8,
      },
      datalabels: datalabelsConfig
    }
  };

  static afterRegister(): void {
    registry.addScales(HappinessCategoryScale);
    registry.addPlugins(ChartDataLabels);
  }

  public _calculateBarIndexPixels(index, ruler) {
    const scale = ruler.scale;
    const options = (this as any).options;
    const skipNull = options.skipNull;
    const maxBarThickness = Infinity; // valueOrDefault(options.maxBarThickness, Infinity);
    let center, size;
    if (ruler.grouped) {
      const stackCount = skipNull
        ? (this as any)._getStackCount(index)
        : ruler.stackCount;

      const stackIndex = (this as any)._getStackIndex(
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

  /*
  public override updateElement(element, index, properties, mode) {
    console.log(element, index, properties, mode);
    super.updateElement(element, index, properties, mode);
  }
  */

  /*
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
  */

  public override draw() {
    super.draw();
  }
}

const HappinessBarChart = createTypedChart(
  'happiness-bar',
  HappinessBarController
);

export default HappinessBarChart;
