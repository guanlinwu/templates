
/**
 * 刮刮卡
 *
 * @export
 * @class SmartCanvas
 */
function SmartCanvas(elementSelector, options) {
  /**
   * 配置参数
   */
  this.$defaults = {
      ...SmartCanvas.DEFAULTS,
      ...options
  };
  /**
   * 获取挂在的canvas对象和绘制对象
  */
  this.$canvas = document.querySelector(elementSelector) || document.createElement('canvas');
  this.ctx = this.$canvas.getContext('2d');

  /**
   * 当前图片绘制组绘制的图片索引
   */
  this.curDrawGroupIndex = 0;
  /**
   * 绘制canvas，初始化canvas的样式，一般canvas的宽高就是设计稿图片的宽高，样式的宽一般用100%自适应
   */
  if (this.isSupport() && this.$canvas) {
      this.$canvas.width = this.$defaults.psd.width;
      this.$canvas.height = this.$defaults.psd.height;
  }
}

/**
* 判断是否支持canvas
*
* @returns
* @memberof SmartCanvas
*/
SmartCanvas.prototype.isSupport = function () {
  return typeof this.$canvas.getContext === 'function';
}

/**
* 批量绘制图片组
*
* @param {*} imageArr
* @returns
* @memberof SmartCanvas
*/
SmartCanvas.prototype.drawGroupImages = function (imageArr, callback) {
  var self = this;
  /**
   * 递归绘制图片，按照imageArr的顺序绘制
   */
  if (self.curDrawGroupIndex >= imageArr.length) {
      callback && typeof callback === 'function' && callback();
  } else {
      self.drawOnceImg(imageArr[self.curDrawGroupIndex++], function () {
          self.drawGroupImages(imageArr, callback);
      });
  }
}

/**
 * 在canvas上绘制图片
 *
 * @param {*} imageOptions 图片配置
 * @param {*} imageOptions.src 图片链接
 * @param {*} imageOptions.x 图片x坐标 基于设计稿计算
 * @param {*} imageOptions.y 图片y坐标 基于设计稿计算
 * @param {*} imageOptions.drawWidth 图片绘制宽度 默认用原图的宽度
 * @param {*} imageOptions.drawHeight 图片绘制高度 默认用原图的高度
 * @returns
 * @memberof SmartCanvas
 */
SmartCanvas.prototype.drawOnceImg = function (imageOptions, callback) {
  var self = this,
      src = imageOptions.src,
      x = imageOptions.x,
      y = imageOptions.y,
      drawWidth = imageOptions.drawWidth,
      drawHeight = imageOptions.drawHeight;

  var $imgDom = new Image();
    $imgDom.setAttribute('crossOrigin', 'Anonymous'); //解决图片跨域

  $imgDom.onload = () => {
      self.ctx.save();
      self.ctx.drawImage($imgDom, x, y, drawWidth || $imgDom.naturalWidth, drawHeight || $imgDom.naturalHeight);
      self.ctx.restore();
      callback && typeof callback === 'function' && callback();
  }
  $imgDom.onerror = (err) => {
      callback && typeof callback === 'function' && callback();
  }
  $imgDom.src = src;
}

/**
* 导出最后绘制的图片
*
* @param {string} [options={
*     type: 'png' //图片格式
*   }]
* @returns
* @memberof SmartCanvas
*/
SmartCanvas.prototype.exportImage = function (options) {
  var type = options ? options.type || 'png' : 'png';
  // var imageSrc = this.$canvas.toDataURL('image/' + type);
  var imageSrc = this.$canvas.toDataURL();
  return imageSrc;
}

/**
*实例销毁，释放内存
*
* @memberof SmartCanvas
*/
SmartCanvas.prototype.destroyed = function () {
  this.$canvas = null;
  this.ctx = null;
}

SmartCanvas.DEFAULTS = {
  psd: { //psd设计稿，海报的图片宽度和高度
      width: 750,
      height: 1334
  }
}



