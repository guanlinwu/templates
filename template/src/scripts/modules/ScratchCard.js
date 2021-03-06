
/**
 * 刮刮卡
 *
 * @export
 * @class ScratchCard
 */
export default class ScratchCard {
  constructor (elementSelector, options) {
    this.$defaults = {
      ...ScratchCard.DEFAULTS,
      ...options
    }
    this.$canvas = document.querySelector(elementSelector)
    this.ctx = this.$canvas.getContext('2d')
    this.hasEmitOnceTouch = true
    this.lastPos = { // 记录上一次移动位置
      x: 0,
      y: 0
    }
    this.radio = this.$canvas.width / this.$canvas.offsetWidth // 计算坐标倍率
    this.timer = null
    this.isSupportTouch = 'ontouchstart' in window
    this.tapStart = this.isSupportTouch ? 'touchstart' : 'mousedown'
    this.tapMove = this.isSupportTouch ? 'touchmove' : 'mousemove'
    this.tapEnd = this.isSupportTouch ? 'touchend' : 'mouseup'
    // 绑定事件
    this.bindEvent()
    // 绘制canvas
    if (this.isSupport()) {
      if (this.$defaults.bgImg) {
        this.drawOnceImg({
          src: this.$defaults.bgImg,
          x: 0,
          y: 0
        })
      } else {
        this.ctx.fillStyle = this.$defaults.maskColor
        this.ctx.fillRect(0, 0, this.$canvas.width, this.$canvas.height)
        this.ctx.globalCompositeOperation = 'destination-out'
      }
      this.ctx.lineCap = 'round' // 设置线条两端为圆弧
      this.ctx.lineJoin = 'round' // 设置线条转折为圆弧
      this.ctx.lineWidth = this.$defaults.ERASER_SIZE * 2 // 设置线条大小
    }
  }
  /**
   * 判断是否支持canvas
   *
   * @returns
   * @memberof ScratchCard
   */
  isSupport () {
    return typeof this.$canvas.getContext === 'function'
  }
  /**
   * 获取touchstart touchmove的坐标值
   *
   * @param {*} e
   * @returns
   * @memberof ScratchCard
   */
  getPos (e) {
    let x = this.isSupportTouch ? e.targetTouches[0].pageX : e.pageX
    let y = this.isSupportTouch ? e.targetTouches[0].pageY : e.pageY
    return {
      x: (x - this.getElementLeft(this.$canvas)) * this.radio,
      y: (y - this.getElementTop(this.$canvas)) * this.radio
    }
  }
  /**
   * 获取绝对位置的横坐标
   *
   * @param {*} element
   * @returns
   * @memberof ScratchCard
   */
  getElementLeft (element) {
    var actualLeft = element.offsetLeft
    var current = element.offsetParent

    while (current !== null) {
      actualLeft += current.offsetLeft
      current = current.offsetParent
    }
    return actualLeft
  }
  /**
   * 获取绝对位置的纵坐标
   *
   * @param {*} element
   * @returns
   * @memberof ScratchCard
   */
  getElementTop (element) {
    var actualTop = element.offsetTop
    var current = element.offsetParent

    while (current !== null) {
      actualTop += current.offsetTop
      current = current.offsetParent
    }
    return actualTop
  }
  /**
   * 绘制透明
   *
   * @param {*} pos
   * @param {*} lastPos
   * @memberof ScratchCard
   */
  drawEraser (pos, lastPos) {
    if (lastPos) {
      this.ctx.beginPath()
      this.ctx.moveTo(lastPos.x, lastPos.y)
      this.ctx.lineTo(pos.x, pos.y)
      this.ctx.stroke()
      this.lastPos = {
        ...pos
      }
    } else {
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.arc(pos.x, pos.y, this.$defaults.ERASER_SIZE, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()
    }
  }
  /**
   * touch开始
   *
   * @param {*} e
   * @memberof ScratchCard
   */
  touchStart (e) {
    e.preventDefault()
    clearTimeout(this.timer)
    this.ctx.globalCompositeOperation = 'destination-out'
    let pos = this.getPos(e)
    this.$defaults.isDraw = true
    this.lastPos = pos
    this.drawEraser(pos)
    /**
     * 异步执行，触发初次刮的回调函数
     */
    setTimeout(() => {
      if (this.hasEmitOnceTouch && typeof this.$defaults.onceTouchCall === 'function') {
        this.$defaults.onceTouchCall()
        this.hasEmitOnceTouch = false
      }
    }, 0)
  }
  /**
   * touch移动
   *
   * @param {*} e
   * @memberof ScratchCard
   */
  touchMove (e) {
    e.preventDefault()
    clearTimeout(this.timer)
    let self = this

    if (self.$defaults.isDraw) {
      let posObj = self.getPos(e)
      self.drawEraser(posObj, self.lastPos)
    }
  }
  /**
   * touch 结束
   *
   * @param {*} e
   * @memberof ScratchCard
   */
  touchEnd (e) {
    e.preventDefault()
    this.timer = setTimeout(() => {
      this.checkPixelPer()
    }, 200)
    this.reset()
  }
  /**
   * 检查像素的百分比
   *
   * @memberof ScratchCard
   */
  checkPixelPer () {
    console.time('timer')
    let imageData = this.ctx.getImageData(0, 0, this.$canvas.width, this.$canvas.height)
    let pixels = imageData.data
    let area = imageData.width * imageData.height
    let distance = this.$defaults.sampleDistance
    let exitNum = 0
    // for (let index = 3; index < pixels.length; index += 4) {
    //   const pix = pixels[index];
    //   pix > 0 && exitNum++;
    // }
    // if (exitNum / area <= this.$defaults.ratio) {
    //   console.log('可以清除画布了')
    // }
    for (let index = 3; index < pixels.length; index += 4 * distance) {
      const pix = pixels[index]
      pix > 0 && exitNum++
    }
    if (exitNum / (area / distance) <= this.$defaults.ratio) {
      this.$canvas.classList += ` ${this.$defaults.fadeOutClass}`
      typeof this.$defaults.resultCall === 'function' && this.$defaults.resultCall()
      setTimeout(() => {
        this.destroyed()
      }, 1000)
    }

    console.timeEnd('timer')
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
  async drawOnceImg (imageOptions) {
    let self = this
    let { src, x, y, drawWidth, drawHeight } = imageOptions

    return new Promise((resolve, reject) => {
      let $imgDom = new Image()
      $imgDom.setAttribute('crossOrigin', 'Anonymous') // 解决图片跨域
      console.log($imgDom)
      $imgDom.onload = () => {
        console.log($imgDom.naturalWidth)
        console.log($imgDom.naturalHeight)
        self.ctx.save()
        self.ctx.drawImage($imgDom, x, y, drawWidth || $imgDom.naturalWidth, drawHeight || $imgDom.naturalHeight)
        self.ctx.restore()
        resolve()
      }
      $imgDom.onerror = (err) => {
        reject(err)
      }
      $imgDom.src = src
    })
  }

  /**
   * 绑定事件
   *
   * @memberof ScratchCard
   */
  bindEvent () {
    this.$canvas.addEventListener(this.tapStart, this.touchStart.bind(this), false)
    this.$canvas.addEventListener(this.tapMove, this.touchMove.bind(this), false)
    this.$canvas.addEventListener(this.tapEnd, this.touchEnd.bind(this), false)
  }
  /**
   * 禁止滑动时候的默认行为
   *
   * @param {*} e
   * @memberof ScratchCard
   */
  preventDefault (e) {
    // 判断默认行为是否可以被禁用
    if (e.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!e.defaultPrevented) {
        e.preventDefault()
      }
    }
  }
  /**
   *每次touchend都要重制的一些数据
   *
   * @memberof ScratchCard
   */
  reset () {
    this.$defaults.isDraw = false
    this.lastPos = {
      x: 0,
      y: 0
    }
  }
  /**
   *实例销毁，释放内存
   *
   * @memberof ScratchCard
   */
  destroyed () {
    this.reset()
    delete this.lastPos
    this.timer = null
    this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height)
    this.$canvas.removeEventListener(this.tapStart, this.touchStart.bind(this), false)
    this.$canvas.removeEventListener(this.tapMove, this.touchMove.bind(this), false)
    this.$canvas.removeEventListener(this.tapEnd, this.touchEnd.bind(this), false)
  }
}

ScratchCard.DEFAULTS = {
  sampleDistance: 10, // 每隔多少个颜色值去检测，防止检测每个像素卡频
  ratio: 0.76, // 剩下像素点的比值，小于这个比值的时候，就清除画布
  ERASER_SIZE: 30,
  maskColor: '#999',
  fadeOutClass: 'e-fadeout',
  onceTouchCall: null, // 当用户第一次开始刮的时候调用的函数
  resultCall: null, // 刮完卡后，显示结果的回调函数
  isDraw: false // 是否在绘画
  // bgImg: '/static/img/scratch_bg_none.png' // 背景图片
}
