export function drawImageAt(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  size: number,
  x: number = 0,
  y: number = 0
) {
  const { width: oWidth = size, height: oHeight = size } = image
  let adjWidth: number = oWidth,
    adjHeight: number = oHeight
  if (oWidth > oHeight) {
    adjWidth = size
    adjHeight = (oHeight * size) / oWidth
  } else {
    adjWidth = (oWidth * size) / oHeight
    adjHeight = size
  }
  // image, dx, dy, width, height
  ctx.drawImage(image, x - adjWidth / 2, y - adjHeight, adjWidth, adjHeight)
}

export function drawGradientTab(
  ctx: CanvasRenderingContext2D,
  startColor: string,
  stopColor: string,
  x: number,
  width = 120,
  y = 0
) {
  const height = 25
  const gradient = ctx.createLinearGradient(0, y - height, 0, y)
  gradient.addColorStop(0, stopColor)
  gradient.addColorStop(1, startColor)
  ctx.fillStyle = gradient

  const region = new Path2D()
  // region.roundRect(x - width / 2, y - height, width, height * 2, 16)
  region.roundRect(x - width / 2, y - height, width, height, [16, 16, 0, 0])
  ctx.fill(region)
}
