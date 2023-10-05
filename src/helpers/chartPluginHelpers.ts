import { Chart } from 'chart.js'
import { FontStyle, getStyleForLabel } from './happinessStyleHelpers'

import { HappinessDataPoint, HappinessChartDataset } from '@/chart/HappinessBarChart'

type DatalabelsScriptableOptionContext = {
  active: boolean
  chart: Chart
  dataIndex: number
  datasetIndex: number
  dataset: HappinessChartDataset
}

export const datalabelsConfig = {
  labels: {
    colValue: {
      anchor: 'end',
      align: 'top',
      display: function (context: DatalabelsScriptableOptionContext) {
        const { dataset: { data = [] } = {}, datasetIndex, dataIndex } = context
        const value = data[dataIndex]
        return !!getStyleForLabel(datasetIndex > 0 ? 'Workplace' : value.x).colDataFont
      },
      font: function (context: DatalabelsScriptableOptionContext) {
        const { dataset: { data = [] } = {}, datasetIndex, dataIndex } = context
        const value = data[dataIndex]
        return {
          family: 'Roboto',
          weight: 'bold',
          ...getStyleForLabel(datasetIndex > 0 ? 'Workplace' : value.x).colDataFont,
        }
      },
      color: function (context: DatalabelsScriptableOptionContext) {
        const { dataset: { data = [] } = {}, datasetIndex, dataIndex } = context
        const value = data[dataIndex]
        return (getStyleForLabel(datasetIndex > 0 ? 'Workplace' : value.x).colDataFont as FontStyle).color
      },
      formatter: function (value: HappinessDataPoint, context: DatalabelsScriptableOptionContext) {
        const { datasetIndex } = context
        return new Intl.NumberFormat('default', {
          style: 'percent',
          minimumFractionDigits: datasetIndex > 0 ? 1 : 0,
          maximumFractionDigits: datasetIndex > 0 ? 1 : 0,
        }).format(value.y as number)
      },
    },
    value: {
      anchor: 'start',
      align: 'bottom',
      font: function (context: DatalabelsScriptableOptionContext) {
        const { dataset: { data = [] } = {}, datasetIndex, dataIndex } = context
        const value = data[dataIndex]
        return {
          family: 'Roboto',
          weight: 'bold',
          ...getStyleForLabel(datasetIndex > 0 ? 'Workplace' : value.x).dataFont,
        }
      },
      color: function (context: DatalabelsScriptableOptionContext) {
        const { dataset: { data = [] } = {}, datasetIndex, dataIndex } = context
        const value = data[dataIndex]
        return getStyleForLabel(datasetIndex > 0 ? 'Workplace' : value.x).dataFont.color
      },
      formatter: function (value: HappinessDataPoint, context: DatalabelsScriptableOptionContext) {
        const { datasetIndex } = context
        return new Intl.NumberFormat('default', {
          style: 'percent',
          minimumFractionDigits: datasetIndex > 0 ? 1 : 0,
          maximumFractionDigits: datasetIndex > 0 ? 1 : 0,
        }).format(value.y as number)
      },
    },
  },
}
