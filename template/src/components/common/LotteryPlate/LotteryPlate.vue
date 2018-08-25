/* 走马灯抽奖活动
 * usage: <LotteryPlate />
*/
<template>
  <div class="m-lottery-plate f-clearfix">
      <div class="lotter-outer">
        <div class="lottery-item" data-index="0"></div>
        <div class="lottery-item" data-index="1"></div>
        <div class="lottery-item" data-index="2"></div>
        <div class="lottery-item" data-index="7"></div>
        <div class="lottery-item btn-lottery" @click="handleLottery"></div>
        <div class="lottery-item" data-index="3"></div>
        <div class="lottery-item" data-index="6"></div>
        <div class="lottery-item" data-index="5"></div>
        <div class="lottery-item" data-index="4"></div>
      </div>
      <div class="awards">
      </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Api from '@/api';
import MLotteryPlate from '@/scripts/modules/LotteryPlate';
import Public from '@/scripts/Public';

export default {
  name: 'LotteryPlate',
  data () {
    return {
      lotteryPlateDom: null
    };
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  mounted () {
    this.lotteryPlateDom = new MLotteryPlate('.lottery-plate-box', '.lottery-item');
    this.setLotteryPlateDom(this.lotteryPlateDom);
  },
  methods: {
    ...mapMutations([
      'toggleLogin',
      'setLotteryPlateDom',
      'showDialog'
    ]),
    handleLottery () {
      if (this.lotteryPlateDom.isPlaying()) {
        console.log('playing...')
        return;
      }

      if (this.userInfo.phone !== undefined) { //如果已经登录过了,则直接调用抽奖接口
        Api.awardDraw({
          phone : this.userInfo.phone
        }).then(res => { //执行抽奖接口
          this.$loading().hide();

          if (res.flag) { //如果成功抽奖
            let _ownOrder = +res.content.ownOrder,
              _award = res.content.award,
              _awardOrder = Public.convertIndex(_ownOrder),
              _lotteryPlateDom = this.lotteryPlateDom;

            /**
             * 检查是否实例抽奖盘，如果没有，则实例化
             */
            if (this.lotteryPlateDom === null || this.lotteryPlateDom === undefined) {
              _lotteryPlateDom = new MLotteryPlate('.lottery-plate-box', '.lottery-item');
            }

            _lotteryPlateDom.play(_awardOrder).then(() => {
              if (_ownOrder === -1) { //如果是谢谢参与
                this.showDialog({
                  title: '对不起',
                  message: '很遗憾，您尚未中奖。'
                })
              } else {
                this.showDialog({
                  title: '恭喜你',
                  message: `恭喜您，成功获得${_award}。和包券将在10个工作日内容赠送到账，请注意查收。`
                })
              }
            });
          } else { //如果抽奖失败
            if (+res.content.status === -201) {
              this.toggleLogin(true); //弹出登录框
            } else {
              this.$toast({message: res.message});
            }
          }
        }, errror => { //如果接口失败
          this.$loading().hide();
          // this.$toast({
          //   message: '网络状态不好～'
          // });
          console.log(`message: '网络状态不好～'`)
        });
      } else {
        this.toggleLogin();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.m-lottery-plate {
  margin: 0 auto;
  width: 6.94rem;
  height: 6.94rem;
  text-align: center;
  background: url(./images/awards_bg.png) no-repeat;
  background-size: 100% 100%;
  overflow: hidden;

  .lotter-outer {
    display: flex;
    margin: .2rem auto 0;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 6.48rem;
    border: .04rem solid #542513;
    border-radius: .1rem;
    overflow: hidden;
  }


  .lottery-item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 33.33%;
    height: 2.14rem;
    transition: background-color 0s ease;
    background: #fff5d2;

    &.e-active {
      background-color: #ffec6c;
    }
  }

  .awards {
    position: absolute;
    top: .52rem;
    left: 50%;
    transform: translateX(-50%);
    width: 6rem;
    height: 5.86rem;
    pointer-events: none;
    background: url(./images/awards.png) no-repeat;
    background-size: 100% 100%;
  }
}
</style>
