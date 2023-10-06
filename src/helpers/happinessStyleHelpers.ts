import amazingImgUrl from '@/assets/Amazing-Face.svg'
import goodImgUrl from '@/assets/Good-Face.svg'
import okayImgUrl from '@/assets/Okay-Face.svg'
import riskImgUrl from '@/assets/Risk-Face.svg'
import highRiskImgUrl from '@/assets/High-Risk-Face.svg'

export interface FontStyle {
  color: string
  size: number
  lineHeight?: number | string
}

export interface GradientStyle {
  start: string
  end: string
}

export interface TabStyle {
  text: string
  font: 'bold 14px Roboto' | '14px Roboto'
  gradient: GradientStyle
}

export interface HappinessStyle {
  label: string
  tab: TabStyle
  gradient: GradientStyle
  labelFont: FontStyle
  dataFont: FontStyle
  colDataFont?: FontStyle
}

function createImage(url: string) {
  const image = new Image()
  image.src = url
  return image
}

// Overlap: 18, maybe 20
// Image width: 53, maybe call it 50
function createCombinedImage(urls: string[], reverse = false) {
  const imgW = 50,
    imgOver = 18
  const canvas = document.createElement('canvas')
  canvas.width = urls.length * imgW - (urls.length - 1) * imgOver
  canvas.height = imgW + 8
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  let x = 0
  if (!reverse) {
    for (let i = 0; i < urls.length; i++) {
      ctx.drawImage(createImage(urls[i]), x, 0, imgW, imgW)
      x += imgW - imgOver
    }
  } else {
    for (let i = urls.length - 1; i >= 0; i--) {
      ctx.drawImage(createImage(urls[i]), x, 0, imgW, imgW)
      x += imgW - imgOver
    }
  }
  return canvas
}

function getGradientCreator(startColor: string, stopColor: string) {
  return (ctx = null as CanvasRenderingContext2D | null, bottom = 100, top = 0, value = 1) => {
    if (startColor === stopColor) {
      return startColor
    }
    if (!ctx) {
      ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D
    }
    const height = Math.abs(top - bottom) * value
    const gradient = ctx.createLinearGradient(0, bottom, 0, bottom - height)
    gradient.addColorStop(0, startColor)
    gradient.addColorStop(1, stopColor)
    return gradient
  }
}

export function getGradientCreatorForLabel(label: string) {
  const {
    gradient: { start, end },
  } = getStyleForLabel(label)
  return getGradientCreator(start, end)
}

export function createImageForLabel(label: string) {
  switch (label) {
    case 'Very Happy + Happy':
      return createCombinedImage([amazingImgUrl, goodImgUrl])
    case 'Very Happy':
      return createImage(amazingImgUrl)
    case 'Happy':
      return createImage(goodImgUrl)
    case 'Content':
      return createImage(okayImgUrl)
    case 'Unhappy':
      return createImage(riskImgUrl)
    case 'Very Unhappy':
      return createImage(highRiskImgUrl)
    case 'Not Happy':
      return createCombinedImage([okayImgUrl, riskImgUrl, highRiskImgUrl])
  }
  return new Image()
}

export function getStyleForLabel(key: string): HappinessStyle {
  switch (key) {
    case 'Very Happy + Happy':
      return {
        label: key,
        tab: { text: 'Goal: 100%', font: 'bold 14px Roboto', gradient: { start: '#081E3F', end: '#008FCF' } },
        gradient: { start: '#081E3F', end: '#008FCF' },
        labelFont: { color: '#008FCF', size: 14 },
        // background: linear-gradient(0deg, #008FCF, #008FCF), linear-gradient(0deg, #24B5BE, #24B5BE), linear-gradient(0deg, #8B929C, #8B929C);
        dataFont: { color: '#008FCF', size: 16, lineHeight: '30px' },
        colDataFont: { color: '#000000', size: 19 },
      }
    case 'Very Happy':
      return {
        label: key,
        tab: { text: 'Amazing', font: '14px Roboto', gradient: { start: '#00557B', end: '#07B2FF' } },
        gradient: { start: '#00557B', end: '#07B2FF' },
        labelFont: { color: '#008FCF', size: 18 },
        dataFont: { color: '#008FCF', size: 18, lineHeight: '30px' },
      }
    case 'Happy':
      return {
        label: key,
        tab: { text: 'Good', font: '14px Roboto', gradient: { start: '#265B5F', end: '#24B5BE' } },
        gradient: { start: '#265B5F', end: '#24B5BE' },
        labelFont: { color: '#24B5BE', size: 18 },
        dataFont: { color: '#24B5BE', size: 18, lineHeight: '30px' },
      }
    case 'Content':
      return {
        label: key,
        tab: { text: 'Okay', font: '14px Roboto', gradient: { start: '#4F4F4F', end: '#BBBBBB' } },
        gradient: { start: '#4F4F4F', end: '#BBBBBB' },
        labelFont: { color: '#B9B9B9', size: 18 },
        dataFont: { color: '#B9B9B9', size: 18, lineHeight: '30px' },
      }
    case 'Unhappy':
      return {
        label: key,
        tab: { text: 'Risk', font: '14px Roboto', gradient: { start: '#9A4100', end: '#FFA800' } },
        gradient: { start: '#9A4100', end: '#FFA800' },
        labelFont: { color: '#FFA800', size: 18 },
        dataFont: { color: '#FFA800', size: 18, lineHeight: '30px' },
      }
    case 'Very Unhappy':
      return {
        label: key,
        tab: { text: 'High Risk', font: '14px Roboto', gradient: { start: '#9A4100', end: '#FF5C00' } },
        gradient: { start: '#9A4100', end: '#FF5C00' },
        labelFont: { color: '#FF5C00', size: 18 },
        dataFont: { color: '#FF5C00', size: 18, lineHeight: '30px' },
      }
    case 'Not Happy':
      return {
        label: key,
        tab: { text: 'Take Action', font: 'bold 14px Roboto', gradient: { start: '#4F0000', end: '#FF4D00' } },
        gradient: { start: '#FF5C00', end: '#FFA800' },
        labelFont: { color: '#545454', size: 14 },
        dataFont: { color: '#FF5C00', size: 16, lineHeight: '30px' },
        colDataFont: { color: '#000000', size: 19 },
      }
  }
  return {
    label: 'Workplace',
    tab: { text: '', font: '14px Roboto', gradient: { start: '#162438', end: '#162438' } },
    gradient: { start: '#162438', end: '#162438' },
    labelFont: { color: '#162438', size: 14 },
    dataFont: { color: '#162438', size: 14, lineHeight: '30px' },
  }
}
