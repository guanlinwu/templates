window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

window.cancelRequestAnimFrame = (function () {
  return window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    clearTimeout
})();

class CicleLoad {
  constructor(opts) {
    this.canvasDom = opts.canvasDom;
    this.ctx = this.canvasDom.getContext('2d');
    this.options = {
      ...CicleLoad.Default,
      circleX: this.canvasDom.width / 2, //中心x坐标
      circleY: this.canvasDom.height / 2, //中心y坐标
      ...opts
    };
    this.percent = this.options.percent || 0;
    this.process = 0;
    this.timer = null;

    this.circle(this.options.circleX, this.options.circleY, this.options.radius);
  }
  /**
   * 设置百分比，并开始动画
   *
   * @param {any} percent
   * @memberof CicleLoad
   */
  setPercent(percent) {
    this.percent = percent || 0;
    this.loading();
  }

  /**
   * 画圆
   *
   * @param {any} cx
   * @param {any} cy
   * @param {any} r
   * @memberof CicleLoad
   */
  circle(cx, cy, r) {
    this.ctx.beginPath(); //开始画
    //圆环线条的宽度
    this.ctx.lineWidth = this.options.lineWidth;
    this.ctx.lineCap = 'round';
    //填充的颜色
    this.ctx.strokeStyle = this.options.strokeStyle;
    //开始结束角度控制着不是完整的圆环，只画了一部分，根据你的角度来定
    this.ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
    this.ctx.stroke();//描边
  }
  /**
   * 画圆弧
   *
   * @param {any} cx
   * @param {any} cy
   * @param {any} r
   * @param {any} startAngle
   * @param {any} endAngle 进度比值
   * @memberof CicleLoad
   */
  sector(cx, cy, r, startAngle, endAngle) {
    this.ctx.beginPath(); //开始画
    this.ctx.lineWidth = this.options.lineWidthL;
    // 渐变色 - 可自定义
    //createLinearGradient参数依次为：渐变开始点的 x 坐标， 渐变开始点的 y 坐标， 渐变结束点的 x 坐标， 渐变结束点的 y 坐标
    // var linGrad = ctx.createLinearGradient(circleX, (circleY - radius - lineWidth), circleX, (circleY + radius + lineWidth));
    // //规定 gradient 对象中的位置和颜色。
    // linGrad.addColorStop(0.00, '#ffba4d');
    // linGrad.addColorStop(1.00, '#ff7163');
    // 圆弧两端的样式“圆环”
    // ctx.strokeStyle = linGrad;
    this.ctx.strokeStyle = this.options.strokeStyleL;
    this.ctx.lineCap = 'round'; // 圆弧
    this.ctx.arc(cx, cy, r, startAngle, endAngle * (Math.PI / 180.0) + Math.PI * 0.75)
    this.ctx.stroke();
  }
  /**
   * 开始动画
   *
   * @returns
   * @memberof CicleLoad
   */
  loading() {
    //当到达所规定的位置时，停止动画
    if (this.process >= this.percent) {
      // cancelRequestAnimFrame(this.timer);
      return;
    }
    // 清除canvas内容
    this.ctx.clearRect(0, 0, this.options.circleX * 2, this.options.circleY * 2);
    // 圆环方法调用
    this.circle(this.options.circleX, this.options.circleY, this.options.radius);
    // 圆弧方法调用
    this.sector(this.options.circleX, this.options.circleY, this.options.radius, Math.PI * 0.75, this.process / 100 * 270);
    // 控制结束时动画的速度
    if (this.process / this.percent > 0.90) {
      this.process += 0.30;
    } else if (this.process / this.percent > 0.80) {
      this.process += 0.55;
    } else if (this.process / this.percent > 0.70) {
      this.process += 0.75;
    } else {
      this.process += 1.0;
    }
    this.timer = requestAnimationFrame(this.loading.bind(this));
  }
}

CicleLoad.Default = {
  radius: 120, //圆环半径
  lineWidth: 10, //圆形线条的宽度
  strokeStyle: '#00629a', //外圆形的线条颜色
  strokeStyleL: '#ffffff', //内圆形的线条颜色
  lineWidthL: 10 //内圆形线条的宽度
}

export default CicleLoad;
// let cicleLoad = new CicleLoad({
//     canvasDom: document.getElementById('rating'),
//     percent : 20
// });
