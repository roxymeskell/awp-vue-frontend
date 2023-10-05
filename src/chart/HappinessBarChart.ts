import { createTypedChart } from 'vue-chartjs'
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
} from 'chart.js'
import { merge } from 'chart.js/helpers'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import HappinessCategoryScale from './HappinessCategoryScale'
import Gradients from './GradientsPlugin'
import { datalabelsConfig } from '../happinessStyleHelpers'

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
}

class HappinessBarController extends BarController {
  static override id = 'happiness-bar'

  static defaults: any = /*! __PURE__ */ merge({}, [BarController.defaults, defaultConfig])

  static overrides = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { bottom: 50, top: 84 } },
    borderColor: '#BABEC4',
    categoryPercentage: 1,
    borderRadius: 8,
    scales: {
      _index_: { type: 'happiness-category', total_column_width: 70 },
      _value_: {
        type: 'linear',
        beginAtZero: true,
        grid: { drawTicks: false },
        ticks: {
          padding: 10,
          stepSize: 0.25,
          callback: (value) => `${value * 100}%`,
          color: '#8B929C',
          font: { family: 'Roboto', size: 16 },
        },
        position: 'left',
        min: 0,
        max: 1,
      },
    },
    plugins: {
      chartAreaBorder: {
        borderColor: '#BABEC4',
        borderWidth: 1,
        borderRadius: 8,
      },
      datalabels: datalabelsConfig,
    },
  }

  static afterRegister(): void {
    registry.addScales(HappinessCategoryScale)
    registry.addPlugins(ChartDataLabels)
    registry.addPlugins(Gradients)
  }

  public _calculateBarIndexPixels(index, ruler) {
    const scale = ruler.scale
    const options = (this as any).options
    const skipNull = options.skipNull
    const maxBarThickness = Infinity // valueOrDefault(options.maxBarThickness, Infinity);
    let center, size
    if (ruler.grouped) {
      const stackCount = skipNull ? (this as any)._getStackCount(index) : ruler.stackCount

      const stackIndex = (this as any)._getStackIndex(this.index, this._cachedMeta.stack, skipNull ? index : undefined)

      // Chunks:
      // 0: team column
      // 1: workplace column
      if (stackCount > 1) {
        if (stackIndex === 0) {
          size = scale.getPixelForValue(index + '.col.width') // iScale._nodes[index].colWidth;
          center = scale.getPixelForValue(index + '.col.center') // iScale._startPixel + iScale._nodes[index].colCenter;
        } else {
          size = scale.getPixelForValue(index + '.auxCol.width') // iScale._nodes[index].auxColWidth;
          center = scale.getPixelForValue(index + '.auxCol.center') // iScale._startPixel + iScale._nodes[index].auxColCenter;
        }
      } else {
        // For bar charts with only one stack, exact full column values are used
        center = scale.getPixelForValue(index + '.fullCol.center')
        size = scale.getPixelForValue(index + '.fullCol.width')
      }
    } else {
      // For non-grouped bar charts, exact full column values are used
      center = scale.getPixelForValue(index + '.fullCol.center')
      size = scale.getPixelForValue(index + '.fullCol.width')
    }

    return {
      base: center - size / 2,
      head: center + size / 2,
      center,
      size,
    }
  }

  public override draw() {
    super.draw()
  }
}

const HappinessBarChart = createTypedChart('happiness-bar', HappinessBarController)

export default HappinessBarChart
