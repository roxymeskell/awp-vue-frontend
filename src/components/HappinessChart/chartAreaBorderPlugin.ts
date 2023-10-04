import type { Chart, ChartDataset } from 'chart.js';

export interface ChartAreaBorderPluginOptions {
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

const chartAreaBorder = {
  id: 'chartAreaBorder',
  beforeDraw(chart: Chart, args, options: ChartAreaBorderPluginOptions) {
    const { layout: { padding: { top: paddingTop = 0 } = {} } = {} } = chart.options as any;
    const {
      ctx,
      canvas: { height: canvasHeight },
      chartArea: { left, width }, // top, height
    } = chart;
    const top = 0 + paddingTop;
    const height = canvasHeight - paddingTop;
    ctx.save();
    ctx.strokeStyle = options.borderColor || '';
    ctx.lineWidth = options.borderWidth || 0;
    // ctx.setLineDash(options.borderDash || []);
    // ctx.lineDashOffset = options.borderDashOffset;
    // ctx.strokeRect(left, top, width, height);
    // ctx.roundRect(left, top, width, height, options.borderRadius || 0);
    ctx.roundRect(
      left,
      top,
      width,
      height, // chart.canvas.height,
      options.borderRadius || 0
    );
    console.log('Drawing border plugin', left, 0, width, height, ctx.strokeStyle, ctx.lineWidth)

    // Drawing gridlines
    const scale = chart.scales.x
    const scaleBottom = chart.scales.y.bottom
    let x = scale.getPixelForValue('Very Happy + Happy.center') +
    scale.getPixelForValue('Very Happy + Happy.width') / 2;
    ctx.moveTo(x, top);
    ctx.lineTo(x, height);

    x = scale.getPixelForValue('Happy.center') +
    scale.getPixelForValue('Happy.width') / 2;
    ctx.moveTo(x, top);
    ctx.lineTo(x, scaleBottom);

    x = scale.getPixelForValue('Very Unhappy.center') +
    scale.getPixelForValue('Very Unhappy.width') / 2;
    ctx.moveTo(x, top);
    ctx.lineTo(x, height);

    ctx.stroke();
    ctx.restore();
  },
};

export default chartAreaBorder;
