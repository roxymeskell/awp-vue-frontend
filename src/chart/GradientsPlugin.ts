import type { Chart, ChartDataset } from 'chart.js'
import { getGradientCreatorForLabel } from '@/helpers/happinessStyleHelpers'

type HappinessChartDataset = ChartDataset<'bar', any>

export interface GradientsPluginOptions {
  enabled?: boolean
}

function colorizeWorkplaceDataset(dataset: HappinessChartDataset) {
  dataset.backgroundColor = '#162438'
}

function colorizeTeamDataset(dataset: HappinessChartDataset, chart: Chart) {
  dataset.backgroundColor = dataset.data.map((d: { x: string; y: number }) =>
    getTeamDataBackgroundColor(d.x, chart, d.y)
  )
}

function getTeamDataBackgroundColor(key: string, chart: Chart, value: number = 1) {
  const { ctx = null as CanvasRenderingContext2D | null, chartArea: { top = 100, bottom = 0 } = {} } = chart
  const getGradient = getGradientCreatorForLabel(key)
  return getGradient(ctx, bottom, top, value)
}

function getColorizer(chart: Chart) {
  return (dataset: HappinessChartDataset, datasetIndex: number) => {
    const controller = chart.getDatasetMeta(datasetIndex).controller
    if (controller && dataset.label == 'Workplace') {
      colorizeWorkplaceDataset(dataset)
    } else if (controller) {
      colorizeTeamDataset(dataset, chart)
    }
  }
}

export default {
  id: 'gradients',

  defaults: {
    enabled: true,
    forceOverride: false,
  } as GradientsPluginOptions,

  beforeLayout(chart: Chart<'bar', any, any>, _args: any, options: GradientsPluginOptions) {
    if (!options.enabled) {
      return
    }

    const {
      data: { datasets },
    } = chart.config

    const colorizer = getColorizer(chart)

    datasets.forEach((d: HappinessChartDataset, i: number) => colorizer(d, i))
  },
}
