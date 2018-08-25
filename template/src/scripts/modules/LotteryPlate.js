/**
 * 跑马灯抽奖
 *
 * @export
 * @class LotteryPlate
 */
export default class LotteryPlate {
  constructor (elementSelector, children, options) {
    this.$defaults = {
      ...LotteryPlate.DEFAULTS,
      ...options
    };
    /**
     * 是否在运行
     * @type {Boolean}
     */
    this.$isPlaying = false;
    this.$stage = document.querySelector(elementSelector);
    this.$childrens = document.querySelectorAll(`${elementSelector} ${children}`);
    this.activeClass = this.$defaults.activeClass;
    this.eachTime = this.$defaults.slowTime; //默认为慢速
    this.timmer = null;
    this.orderArr = this.$defaults.orderArr; //大转盘滚动的顺序
    this.lotteryArrOrder = 0; //构造出来的奖品数组的当前索引
  }

  /**
   * 开始玩游戏
   *
   * @param {any} awardIndex 奖品序号
   * @returns
   * @memberof LotteryPlate
   */
  play (awardIndex) {
    let self = this;
    return new Promise((resolve, reject) => {
      if (self.$isPlaying) {
        console.log('正在游戏中···')
        reject({
          message: '正在游戏中···'
        });
      }

      self.$isPlaying = true;
      (awardIndex === undefined) && (awardIndex = 0);
      let _awardInArrIndex = self.orderArr.indexOf(awardIndex),
        _sliceArr = self.orderArr.slice(0, _awardInArrIndex + 1), //截取该序号包括该序号前的奖品
        _lotteryArr = [].concat(self.orderArr, self.orderArr, self.orderArr, self.orderArr, _sliceArr);

      console.log(_lotteryArr)
      this.$defaults.isRandom && (_lotteryArr = self.shuffle(_lotteryArr)); //如果需要随机的话

      self.playLottery(awardIndex, _lotteryArr, _lotteryArr.length);
      console.log((_lotteryArr.length - 8) * self.$defaults.fastTime + 8 * self.$defaults.slowTime + 500)
      setTimeout(() => {
        self.$isPlaying = false;
        resolve();
      }, (_lotteryArr.length - 8) * self.$defaults.fastTime + 8 * self.$defaults.slowTime + 500);
    })
  }

  /**
   * 跑转盘的方法2，这是用settimout的方法，比较简单。用setInterval，有点复杂
   *
   * @param {any} hasRunTime
   * @returns
   * @memberof LotteryPlate
   */

  playLottery (awardIndex, lotteryArr, length) {
    let _lotteryArr = lotteryArr;

    if (this.lotteryArrOrder >= length) {
      console.log('this.lotteryArrOrder' + this.lotteryArrOrder)
      this.stop();
      this.setClass(awardIndex);
      console.log('end');
      return;
    }

    if (this.lotteryArrOrder < 3 || this.lotteryArrOrder > (length - 5)) {
      this.eachTime = this.$defaults.slowTime;
    } else {
      this.eachTime = this.$defaults.fastTime;
    }

    this.setClass(_lotteryArr[this.lotteryArrOrder]);
    this.lotteryArrOrder++;

    this.timmer = setTimeout(() => {
      this.playLottery(awardIndex, _lotteryArr, length);
    }, this.eachTime);
  }

  shuffle (arr) {
    arr.forEach((element, index) => {
      const randomIndex = Math.ceil(Math.random() * index);
      [arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
    });

    return arr;
  }

  /**
   * 判断是否结束游戏
   *
   * @returns
   * @memberof LotteryPlate
   */
  isPlaying () {
    return this.$isPlaying;
  }
  /**
   * 停止游戏
  */
  stop () {
    let self = this;
    clearInterval(self.timmer);
    self.eachTime = self.$defaults.slowTime;
    self.lotteryArrOrder = 0;
    self.$isPlaying = false;
  }

  setClass (index) {
    let $active = this.$stage.querySelector('.e-active');
    !!$active && $active.classList.remove('e-active');
    this.$stage.querySelector(`[data-index="${index}"]`).classList.add('e-active');
  }
}

LotteryPlate.DEFAULTS = {
  activeClass: 'e-active',
  slowTime: 500, //慢速滚的速度
  fastTime: 100, //加速滚的速度
  orderArr: [0, 1, 2, 3, 4, 5, 6, 7], //奖品盘滚动的顺序
  // orderArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], //奖品盘滚动的顺序
  isRandom: false //是否随机，默认不随机闪烁
}

// let lotteryPlateTest = new LotteryPlate('.run-horse-box', '.lottery-item');
// lotteryPlateTest.play(0).then(()=>{
//     console.log('endend~~~~~~~~~~~~')
// });
