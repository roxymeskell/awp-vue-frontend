import amazingImgUrl from './assets/Amazing-Face.svg';
import goodImgUrl from './assets/Good-Face.svg';
import okayImgUrl from './assets/Okay-Face.svg';
import riskImgUrl from './assets/Risk-Face.svg';
import highRiskImgUrl from './assets/High-Risk-Face.svg';

interface FontStyle {
  color: string;
  size: number;
  lineHeight?: number | string;
}

interface TabStyle {
  text: string;
  font: 'bold 14px Roboto' | '14px Roboto';
}
  
export interface HappinessStyle {
  label: string;
  tab: TabStyle;
  gradientEnd: string;
  gradientStart: string;
  labelFont: FontStyle;
  dataFont: FontStyle;
  colDataFont?: FontStyle;
}

function createImage(url: string) {
  const image = new Image();
  image.src = url;
  return image;
}

// Overlap: 18, maybe 20
// Image width: 53, maybe call it 50
function createCombinedImage(urls: string[], reverse = false) {
  const imgW = 50, imgOver = 18;
  const canvas = document.createElement('canvas');
  canvas.width = urls.length * imgW - (urls.length - 1)*imgOver;
  canvas.height = imgW; // 76
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const images: HTMLImageElement[] = urls.map((u) => createImage(u))
  let x = 0
  if (!reverse) {
    for (let i = 0; i < urls.length; i++) {
      ctx.drawImage(createImage(urls[i]), x, 0, imgW, imgW);
      x += imgW - imgOver
    }
  } else {
    for (let i = urls.length - 1; i >= 0; i--) {
      ctx.drawImage(createImage(urls[i]), x, 0, imgW, imgW);
      x += imgW - imgOver
    }
  }
  return canvas;
}

function createGradient(
  startColor: string,
  stopColor: string,
  { ctx = null as CanvasRenderingContext2D | null, chartArea: { top = 100, bottom = 0, height = 100 } = {} } = {},
  value: number = 1
) {
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

function getGradientCreator(
  startColor: string,
  stopColor: string,
) {
  return (ctx = null as CanvasRenderingContext2D | null, bottom = 100, top = 0, value = 1) => {
    if (!ctx) {
      ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
    }
    const height = Math.abs(top - bottom) * value;
    const gradient = ctx.createLinearGradient(0, bottom, 0, bottom - height);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, stopColor);
    return gradient;
  }
}

export function getGradientCreatorForLabel(label) {
  const { gradientStart, gradientEnd } = getStyleForLabel(label);
  return getGradientCreator(gradientStart, gradientEnd);
}

export function createImageForLabel(label) {
  switch (label) {
    case 'Very Happy + Happy':
      return createCombinedImage([amazingImgUrl, goodImgUrl]);
    case 'Very Happy':
      return createImage(amazingImgUrl);
    case 'Happy':
      return createImage(goodImgUrl);
    case 'Content':
      return createImage(okayImgUrl);
    case 'Unhappy':
      return createImage(riskImgUrl);
    case 'Very Unhappy':
      return createImage(highRiskImgUrl);
    case 'Not Happy':
      return createCombinedImage([okayImgUrl, riskImgUrl, highRiskImgUrl]);
  }
}

  
export function getStyleForLabel(key): HappinessStyle {
  switch (key) {
    case 'Very Happy + Happy':
      return {
        label: key,
        tab: { text: 'Goal: 100%', font: 'bold 14px Roboto' },
        gradientEnd: '#008FCF',
        gradientStart: '#081E3F',
        labelFont: { color: '#008FCF', size: 14 },
        // background: linear-gradient(0deg, #008FCF, #008FCF), linear-gradient(0deg, #24B5BE, #24B5BE), linear-gradient(0deg, #8B929C, #8B929C);
        dataFont: { color: '#008FCF', size: 16, lineHeight: '30px' },
        colDataFont: { color: '#000000', size: 19 },
      };
    case 'Very Happy':
      return {
        label: key,
        tab: { text: 'Amazing', font: '14px Roboto' },
        gradientEnd: '#07B2FF',
        gradientStart: '#00557B',
        labelFont: { color: '#008FCF', size: 18 },
        dataFont: { color: '#008FCF', size: 18, lineHeight: '30px' },
      };
    case 'Happy':
      return {
        label: key,
        tab: { text: 'Good', font: '14px Roboto' },
        gradientEnd: '#24B5BE',
        gradientStart: '#265B5F',
        labelFont: { color: '#24B5BE', size: 18 },
        dataFont: { color: '#24B5BE', size: 18, lineHeight: '30px' },
      };
    case 'Content':
      return {
        label: key,
        tab: { text: 'Okay', font: '14px Roboto' },
        gradientEnd: '#BBBBBB',
        gradientStart: '#4F4F4F',
        labelFont: { color: '#B9B9B9', size: 18 },
        dataFont: { color: '#B9B9B9', size: 18, lineHeight: '30px' },
      };
    case 'Unhappy':
      return {
        label: key,
        tab: { text: 'Risk', font: '14px Roboto' },
        gradientEnd: '#FFA800',
        gradientStart: '#9A4100',
        labelFont: { color: '#FFA800', size: 18 },
        dataFont: { color: '#FFA800', size: 18, lineHeight: '30px' },
      };
    case 'Very Unhappy':
      return {
        label: key,
        tab: { text: 'High Risk', font: '14px Roboto' },
        gradientEnd: '#FF5C00',
        gradientStart: '#9A4100',
        labelFont: { color: '#FF5C00', size: 18 },
        dataFont: { color: '#FF5C00', size: 18, lineHeight: '30px' },
      };
    case 'Not Happy':
      return {
        label: key,
        tab: { text: 'Take Action', font: 'bold 14px Roboto' },
        gradientEnd: '#FF4D00',
        gradientStart: '#4F0000',
        // Fuck, the tab gradient is different from the column
        // Tab: linear-gradient(180deg, #FF4D00 0%, #4F0000 100%)
        // Column: linear-gradient(180deg, #FFA800 0%, #FF5C00 99.72%);
        labelFont: { color: '#545454', size: 14 },
        dataFont: { color: '#FF5C00', size: 16, lineHeight: '30px' },
        colDataFont: { color: '#000000', size: 19 },
      };
  }
  return {
    label: 'Workplace',
    tab: { text: '', font: '' },
    gradientEnd: '#162438',
    gradientStart: '#162438',
    labelFont: { color: '#162438', size: 14 },
    dataFont: { color: '#162438', size: 14, lineHeight: '30px' },
  };
}

export const datalabelsConfig = {
  labels: {
    colValue: {
      anchor: 'end',
      align: 'top',
      display: function (context) {
        let {
          dataset: { label = '', data = [] } = {},
          datasetIndex,
          dataIndex,
        } = context;
        let value = data[dataIndex];
        return !!getStyleForLabel(datasetIndex > 0 ? 'Workplace' : value.x)
          .colDataFont;
      },
      font: function (context) {
        let {
          dataset: { label = '', data = [] } = {},
          datasetIndex,
          dataIndex,
        } = context;
        let value = data[dataIndex];
        return {
          family: 'Roboto',
          weight: 'bold',
          ...getStyleForLabel(datasetIndex > 0 ? 'Workplace' : value.x)
            .colDataFont,
        };
      },
      color: function (context) {
        let {
          dataset: { label = '', data = [] } = {},
          datasetIndex,
          dataIndex,
        } = context;
        let value = data[dataIndex];
        return (getStyleForLabel(datasetIndex > 0 ? 'Workplace' : value.x).colDataFont as FontStyle).color;
      },
      formatter: function (value, context) {
        let { dataset: { label = '' } = {}, datasetIndex } = context;
        return new Intl.NumberFormat('default', {
          style: 'percent',
          minimumFractionDigits: datasetIndex > 0 ? 1 : 0,
          maximumFractionDigits: datasetIndex > 0 ? 1 : 0,
        }).format(value.y);
      },
    },
    value: {
      anchor: 'start',
      align: 'bottom',
      font: function (context) {
        let {
          dataset: { label = '', data = [] } = {},
          datasetIndex,
          dataIndex,
        } = context;
        let value = data[dataIndex];
        return {
          family: 'Roboto',
          weight: 'bold',
          ...getStyleForLabel(datasetIndex > 0 ? 'Workplace' : value.x)
            .dataFont,
        };
      },
      color: function (context) {
        let {
          dataset: { label = '', data = [] } = {},
          datasetIndex,
          dataIndex,
        } = context;
        let value = data[dataIndex];
        console.log(
          'data labels',
          context,
          value,
          datasetIndex > 0 ? 'Workplace' : value.y,
          getStyleForLabel(datasetIndex > 0 ? 'Workplace' : value.x).dataFont
            .color
        );
        return getStyleForLabel(datasetIndex > 0 ? 'Workplace' : value.x)
          .dataFont.color;
      },
      formatter: function (value, context) {
        let { dataset: { label = '' } = {}, datasetIndex } = context;
        return new Intl.NumberFormat('default', {
          style: 'percent',
          minimumFractionDigits: datasetIndex > 0 ? 1 : 0,
          maximumFractionDigits: datasetIndex > 0 ? 1 : 0,
        }).format(value.y);
      },
    },
  },
}
