import * as PIXI from 'pixi.js'

/**
 * 碰撞躲避游戏
 * @usage
 *
 * this.game = new AvoidGame(this.$refs.pixiContainer);
    console.log(this.game)

    this.game.start().then(res => {
      console.log(res)
      console.log('游戏结束')
      setTimeout(() => {
        console.log('重新开始游戏')
        this.game.replay().then(res => {
          console.log(res)
        })
      }, 2000);
    }).catch(err => {
      console.log(err)
    })
 * @export
 * @class AvoidGame
 */
export default class AvoidGame {
  constructor(element, options) {
    this.$options = {
      ...AvoidGame.DEFAULTS,
      ...options
    };

    this.$element = element; // 挂在的dom节点
    this.$isPlaying = false; // 是否在运行
    this.loop = 0; // 检测用户已经通过了多少轮询
    this.isActiveMove = false; // 是否可以移动目标
    this.appPixi = null; // pixi app
    this.obstacleInCount = 0; // 在容器视野内的障碍物的数量
    this.bunny = null; // 目标
    this.obstacleArr = []; // 障碍物
    this.flag = true; // 作为标记，障碍物全部进入一次容器记true, 全部离开一次容器记false
    this.isInContainer = null; // 是否在容器里面
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    let self = this;

    let boundingClientRect = document.documentElement.getBoundingClientRect(),
      winHeight = document.documentElement.clientHeight || boundingClientRect.height,
      winWidth = document.documentElement.clientWidth || boundingClientRect.width

    self.$options.dangerDistance = self.$options.dangerDistance * winWidth / self.$options.psd

    self.appPixi = new PIXI.Application(winWidth, winHeight, {
      backgroundColor: '0x1099bb'
    }); // 创建渲染舞台

    self.appPixi.ticker.stop(); // 游戏还没开始
    self.$element.appendChild(self.appPixi.view);

    self.isInContainer = self.inWho({
      x: winWidth / 2,
      y: winHeight / 2,
      width: winWidth,
      height: winHeight
    }) // 库里化函数

    PIXI.loader.resources = {}
    PIXI.loader
      .add([
        'https://pixijs.io/examples/required/assets/p2.jpeg',
        'https://pixijs.io/examples/required/assets/basics/bunny.png',
        'https://pixijs.io/examples/required/assets/flowerTop.png'
      ])
      .load(function () {
        /**
         * 添加背景
         */

        let bgSpriteUp = new PIXI.Sprite(PIXI.loader.resources['https://pixijs.io/examples/required/assets/p2.jpeg'].texture),
          bgSpriteDown = new PIXI.Sprite(PIXI.loader.resources['https://pixijs.io/examples/required/assets/p2.jpeg'].texture)

        bgSpriteUp.width = bgSpriteDown.width = self.appPixi.screen.width;
        bgSpriteUp.height = bgSpriteDown.height = self.appPixi.screen.height;
        bgSpriteUp.vy = bgSpriteDown.vy = 1;
        self.appPixi.stage.addChild(bgSpriteUp);
        self.appPixi.stage.addChild(bgSpriteDown);
        bgSpriteDown.y = 0;
        bgSpriteUp.y = -self.appPixi.screen.height;

        /**
         * 添加目标
         */
        self.bunny = new PIXI.Sprite(PIXI.loader.resources['https://pixijs.io/examples/required/assets/flowerTop.png'].texture)
        self.bunny.anchor.set(0.5);
        self.bunny.scale.set(0.5);
        self.bunny.x = self.appPixi.screen.width / 2;
        self.bunny.y = self.appPixi.screen.height * 0.8;
        self.bunny.buttonMode = true;
        self.bunny.interactive = true;
        console.log('self.bunny.width ' + self.bunny.width)
        console.log('self.bunny.height ' + self.bunny.height)

        self.appPixi.stage.addChild(self.bunny);

        /**
         * 绑定人的事件
         */
        /**
         * 触摸开始
         */
        self.bunny.on('touchstart', function (e) {
          console.log('touchstart ', e)
          self.isActiveMove = true
        });
        /**
         * 触摸移动
         */
        self.bunny.on('touchmove', function (e) {
          if (self.isActiveMove) {
            // console.log('touchmove ', e)
            self.setPostion(self.bunny, {
              x: 0,
              y: 0,
              width: self.appPixi.screen.width,
              height: self.appPixi.screen.height
            }, e.data.global)
          }
        });
        /**
         * 触摸结束
         */
        self.bunny.on('touchend', function (e) {
          console.log('touchend ', e)
          self.isActiveMove = false
        });

        /**
         * 设置背景动画
         */
        self.appPixi.ticker.add(function () {
          // 背景持续的移动
          bgSpriteUp.y += bgSpriteUp.vy;
          bgSpriteDown.y += bgSpriteDown.vy;

          // 背景超出屏幕判断
          bgSpriteUp.y > 0 && (bgSpriteUp.y = -self.appPixi.screen.height)
          bgSpriteDown.y > self.appPixi.screen.height && (bgSpriteDown.y = 0)
        })

        /**
         * 渲染
         */
        self.appPixi.renderer.render(self.appPixi.stage)
      })
  }

  /**
   * 开始游戏
   */
  start() {
    let self = this;

    return new Promise((resolve, reject) => {
      if (self.isPlaying()) {
        return reject('正在游戏中');
      }
      /**
       * 设置动画
       */
      self.appPixi.ticker.add(self.gameTicker.bind(self, resolve, reject));

      self.appPixi.ticker.start();

    });
  }

  /**
   * 设置游戏动画逻辑
   */
  gameTicker(resolve, reject) {
    let self = this
    self.$isPlaying = true

    // 障碍物移动
    self.obstacleInCount = 0;
    self.obstacleArr.forEach(obstacle => {
      obstacle.x += obstacle.vx;
      obstacle.y += obstacle.vy;

      // 检查障碍物和目标的距离是否在危险距离，如果在开启袭击，否则缓慢向目标移动
      self.flushObstacleStep(obstacle, self.bunny)
      // 碰撞检测
      if (self.hitTestRectangle(obstacle, self.bunny)) {
        self.appPixi.ticker.stop()
        self.appPixi.ticker.remove(self.gameTicker)
        self.$isPlaying = false
        return resolve({
          loop: self.loop
        });
      }
      self.isInContainer(obstacle) && self.obstacleInCount++;
    });

    /**
     * 如果所有障碍物都不在容器里面，则准备开始新一轮轮询
     */
    if (self.obstacleInCount <= 0) {
      // 通过了轮询，次数加一
      if (self.flag) {
        console.log('已经都在外面了')
        self.loop++;
        self.flag = false
        console.log(`第${self.loop}轮开始`)

        console.log(self.$options.normalRadio)
        console.log(self.$options.fightRadio)

        //增加难度
        if (self.loop % 2 === 0) {
          self.$options.normalRadio++
          self.$options.fightRadio += 1.5
          // self.$options.dangerDistance -= 50
        }
        if (self.loop % 3 === 0) {
          self.$options.obstacleLength++
        }
        /**
         * 开始重新轮询
         */
        setTimeout(() => {
          self.buildObstacle();
        }, 2000);
      }
    }
    if (self.obstacleInCount >= self.$options.obstacleLength) {
      if (!self.flag) {
        console.log('已经都在里面了')
        self.flag = true
      }
    }
  }

  /**
   * 停止游戏
   */
  stop() {
    this.appPixi.ticker.stop();
  }

  /**
   * 重新开始游戏
   */
  replay() {
    let self = this;
    self.appPixi.destroy(true, { // 销毁游戏
      children: true,
      texture: true,
      baseTexture: true
    })
    self.clear();
    self.init();
    return self.start();
  }

  /**
   * 重置数据
   */
  clear() {
    let self = this
    self.$isPlaying = false; // 是否在运行
    self.loop = 0; // 检测用户已经通过了多少轮询
    self.isActiveMove = false; // 是否可以移动目标
    self.obstacleInCount = 0; // 在容器视野内的障碍物的数量
    self.obstacleArr = []; // 障碍物
    self.$options.obstacleLength = 3; // 障碍物的数量
    self.$options.normalRadio = 5; // 障碍物的正常的速度倍率
    self.$options.fightRadio = 8; // 障碍物袭击时候的速度倍率
    self.flag = true; // 作为标记，障碍物全部进入一次容器记true, 全部离开一次容器记false
  }

  /**
   * 构建障碍物
   */
  buildObstacle() {
    let self = this
    for (let index = 0; index < self.$options.obstacleLength; index++) {
      let obstacle = self.obstacleArr[index]
      if (!obstacle) {
        obstacle = new PIXI.Sprite(PIXI.loader.resources['https://pixijs.io/examples/required/assets/basics/bunny.png'].texture)
        obstacle.anchor.set(0.5);
        obstacle.scale.set(1.5);
        self.obstacleArr.push(obstacle)
        self.appPixi.stage.addChild(obstacle)
      }
      self.obstacleArr[index].vx = 0;
      self.obstacleArr[index].vy = 0;
      self.obstacleArr[index].isFight = false;

      self.setRandomObstacle(self.obstacleArr[index], {
        x: 0,
        y: 0,
        width: self.appPixi.screen.width,
        height: self.appPixi.screen.height * 0.4
      });
    }
  }

  /**
   * 限制拖动范围
   */
  setPostion(sprite, container, movePos) {
    let halfWidth = sprite.width / 2,
      halfHeight = sprite.height / 2,
      resultPos = {
        ...movePos
      }

    if (movePos.x - halfWidth < container.x) { // left
      resultPos = {
        ...resultPos,
        x: container.x + halfWidth
      }
    }

    if (movePos.y - halfHeight < container.y) { // top
      resultPos = {
        ...resultPos,
        y: container.y + halfHeight
      }
    }

    if (movePos.x + halfWidth > container.width) { // right
      resultPos = {
        ...resultPos,
        x: container.width - halfWidth
      }
    }

    if (movePos.y + halfHeight > container.height) { // down
      resultPos = {
        ...resultPos,
        y: container.height - halfHeight
      }
    }

    sprite.position.x = resultPos.x
    sprite.position.y = resultPos.y
  }
  /**
   * 随机设置障碍物的初始化位置
   */
  setRandomObstacle(sprite, container) {
    let randomY = Math.random() * container.height / 2,
      randomX = Math.random() * container.width + 4 * sprite.width - 2 * sprite.width

    if (randomY > container.y && (randomX >= container.x || randomX <= container.width)) {
      Math.random() > 0.5 ? randomY = -sprite.height : Math.random() > 0.5 ? randomX = -sprite.width : randomX = sprite.width
    }
    sprite.x = randomX
    sprite.y = randomY
  }
  /**
   * 移动障碍物，实时调整方向
   */
  flushObstacleStep(sprite, scoleSprite, speedRadio) {
    speedRadio = speedRadio || this.$options.normalRadio

    if (sprite.isFight) {
      return
    }

    let a = scoleSprite.x - sprite.x // 获取 a 边长度
    let b = scoleSprite.y - sprite.y // 获取 b 边长度
    let c = Math.sqrt(a * a + b * b) // 求出斜边 c 长度

    if (c < this.$options.dangerDistance) { // 如果小于危险距离，则开启袭击
      sprite.isFight = true
      speedRadio = this.$options.fightRadio
    }

    let speedX = a / c * speedRadio
    let speedY = b / c * speedRadio
    sprite.vx = speedX
    sprite.vy = speedY
  }

  /**
   * 碰撞检测
   */
  hitTestRectangle(sprite, scoleSprite, allowance) {
    let isHit = false
    allowance = allowance || 10
    sprite.halfWidth = sprite.halfWidth || sprite.width / 2
    sprite.halfHeight = sprite.halfHeight || sprite.height / 2
    scoleSprite.halfWidth = scoleSprite.halfWidth || scoleSprite.width / 2
    scoleSprite.halfHeight = scoleSprite.halfHeight || scoleSprite.height / 2

    let vx = sprite.x - scoleSprite.x
    let vy = sprite.y - scoleSprite.y

    let maxWidth = sprite.halfWidth + scoleSprite.halfWidth - allowance
    let maxHeight = sprite.halfHeight + scoleSprite.halfHeight - allowance

    if (Math.abs(vx) < maxWidth && Math.abs(vy) < maxHeight) {
      isHit = true
      // console.log('hitting')
    }

    return isHit
  }

  /**
   * 判定范围
   */
  inWho(container) {
    let self = this
    return (children) => {
      let isIn = false

      if (self.hitTestRectangle(children, container, 0)) {
        isIn = true
        // console.log('self hitting...')
      }

      return isIn
    }
  }

  /**
   * 判断是否结束游戏
   *
   * @returns
   * @memberof AvoidGame
   */
  isPlaying() {
    return this.$isPlaying;
  }
}

AvoidGame.DEFAULTS = {
  psd: 750, // 设计稿的宽度
  dangerDistance: 300, // 危险距离 在750设计稿下
  normalRadio: 5, // 障碍物的正常的速度倍率
  fightRadio: 8, // 障碍物袭击时候的速度倍率
  obstacleLength: 3 // 障碍物的数量
}
