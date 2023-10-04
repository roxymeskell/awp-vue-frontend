import type { Chart, ChartDataset } from 'chart.js';

type HappinessChartDataset = ChartDataset<'bar', any>;

function createGradient(
  stopColor: string,
  startColor: string,
  { ctx = null as CanvasRenderingContext2D | null, chartArea: { top = 100, bottom = 0, height = 100 } = {} } = {},
  value: number = 1
) {
  console.log('Creating gradient', top, value, bottom, height);
  if (!ctx) {
    ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
  }
  const gradient = ctx.createLinearGradient(
    0,
    bottom,
    0,
    bottom - height * value
  );
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, stopColor);
  ctx.fill();
  ctx.restore();
  return gradient;
}

export interface GradientsPluginOptions {
  enabled?: boolean;
}

function colorizeWorkplaceDataset(dataset: HappinessChartDataset) {
  dataset.backgroundColor = '#162438';
  dataset.categoryPercentage = 0.5;
  // dataset.inflateAmount = 1;
  // dataset.barPercentage = 1
  dataset.maxBarThickness = 20;
}

function colorizeTeamDataset(dataset: HappinessChartDataset, chart: Chart) {
  dataset.backgroundColor = dataset.data.map((d) =>
    getTeamDataBackgroundColor(d.x, chart, d.y)
  );
  // dataset.xAxisID = 'xB'
  dataset.categoryPercentage = 1.0;
  // dataset.barPercentage = 1;
  // dataset.inflateAmount = 80;
  dataset.maxBarThickness = 70;
}

function colorizeTeamData(data, ctx) {
  const key = data.x;
  data.backgroundColor = getTeamDataBackgroundColor(key, ctx);
  return data;
}

function getTeamDataBackgroundColor(
  key: String,
  chart: Chart,
  value: number = 1
) {
  switch (key) {
    case 'Very Happy + Happy':
      return createGradient('#008FCF', '#081E3F', chart, value);
    case 'Very Happy':
      return createGradient('#07B2FF', '#00557B', chart, value);
    case 'Happy':
      return createGradient('#24B5BE', '#265B5F', chart, value);
    case 'Content':
      return createGradient('#BBBBBB', '#4F4F4F', chart, value);
    case 'Unhappy':
      return createGradient('#FFA800', '#9A4100', chart, value);
    case 'Very Unhappy':
      return createGradient('#FF5C00', '#9A4100', chart, value);
    case 'Not Happy':
      return createGradient('#FFA800', '#FF5C00', chart, value);
  }
  return '#162438';
}

function getColorizer(chart: Chart) {
  return (dataset: HappinessChartDataset, datasetIndex: number) => {
    const controller = chart.getDatasetMeta(datasetIndex).controller;
    if (controller && dataset.label == 'Workplace') {
      colorizeWorkplaceDataset(dataset);
    } else if (controller) {
      colorizeTeamDataset(dataset, chart);
    }
  };
}

function formatDataset(dataset: HappinessChartDataset) {
    dataset.data = Object.entries(dataset.data).map(([key, value]) => {
        return {
            x: key.replace('_percent', '').replace('and', '+').split('_').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
            y: value
        }
    });
}

function getFormatter(chart: Chart) {
    return (dataset: HappinessChartDataset, datasetIndex: number) => {
      const controller = chart.getDatasetMeta(datasetIndex).controller;
      if (controller) {
        formatDataset(dataset);
        if (dataset.label == 'Workplace') {
            colorizeWorkplaceDataset(dataset);
          } else {
            colorizeTeamDataset(dataset, chart);
          }
      }
      
    };
  }

export default {
  id: 'gradient',

  defaults: {
    enabled: true,
    forceOverride: false,
  } as GradientsPluginOptions,

  beforeLayout(chart: Chart, _args, options: GradientsPluginOptions) {
    if (!options.enabled) {
      return;
    }
    // console.log(chart.canvas);

    // chart.canvas.getContext();
    // chart.ctx

    const {
      data: { datasets },
      options: chartOptions,
    } = chart.config;
    const { elements } = chartOptions;

    const formatter = getFormatter(chart);

    datasets.forEach(formatter);
  },
};
