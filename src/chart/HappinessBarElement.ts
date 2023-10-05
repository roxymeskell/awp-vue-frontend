import { BarElement } from 'chart.js'
import { merge } from 'chart.js/helpers'

export default class HappinessBarElement extends BarElement {

    static id = 'happiness-bar';
    static defaults: any = /*! __PURE__ */ merge({}, [BarElement.defaults, { borderRadius: 8, backgroundColor: '#162438' }])

    constructor(cfg) {
        console.log('happiness-bar', cfg)
        super(cfg)
    }

    // draw(ctx) {
    //     const {inflateAmount, options: {borderColor, backgroundColor}} = this;
    //     const {inner, outer} = boundingRects(this);
    //     const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;
    
    //     ctx.save();
    
    //     if (outer.w !== inner.w || outer.h !== inner.h) {
    //       ctx.beginPath();
    //       addRectPath(ctx, inflateRect(outer, inflateAmount, inner));
    //       ctx.clip();
    //       addRectPath(ctx, inflateRect(inner, -inflateAmount, outer));
    //       ctx.fillStyle = borderColor;
    //       ctx.fill('evenodd');
    //     }
    
    //     ctx.beginPath();
    //     addRectPath(ctx, inflateRect(inner, inflateAmount));
    //     ctx.fillStyle = backgroundColor;
    //     ctx.fill();
    
    //     ctx.restore();
    // }

}