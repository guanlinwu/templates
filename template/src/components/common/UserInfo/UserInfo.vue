/**
 * usage
 <!-- 用户信息 -->
  作为组件添加进结构
  <UserInfo :userInfo="userInfo" />
 */
<template>
  <div>
    <!-- 基本信息 -->
    <section class="m-user-info">
      <p class="info">
          <span class="logo"></span>
          <span class="phone j-phone">\{{userInfo.phone}}</span>
          <span class="time">\{{time}}</span>
      </p>
      <div class="curmeal">
        现用套餐：\{{userInfo.curMeal}}
      </div>
      <div class="desc f-clearfix">
          <div class="sum-box hardline">
              <p class="title">账户余额</p>
              <p class="cnt"><span class="sum j-sum">\{{userInfo.balance}}</span>元</p>
          </div>
          <div class="flow-box">
              <div class="flow-data">
                  <canvas id="rating" width="250" height="250"></canvas>
              </div>
              <p class="title">可常用流量</p>
              <p class="cnt"><span class="flow j-flow">\{{userInfo.flow}}</span>M</p>
          </div>
        </div>
    </section>

    <!-- 消费记录 -->
    <section class="purchase-history">
      <ul class="purchase-list">
        <li class="purchase-item hardline">
          <div class="title">
            <span class="icon-1"></span>
            <p>近三个月(\{{calThreeMonth(0)}}月-\{{calThreeMonth(2)}}月)月均流量：
              <span class="e-blue" v-if="!!userInfo.flowHistory">\{{userInfo.flowHistory.avg}}M</span>
            </p>
            <a href="javascript:;" @click="toggleHistory('isShowFlowHistory')" class="to-detail">详情<span class="icon-2" :class="{'e-show': isShowFlowHistory}"></span></a>
          </div>
          <ul class="content-list" v-show="isShowFlowHistory" v-if="!!userInfo.flowHistory">
            <li  v-for="(item, index) in userInfo.flowHistory.list" :key="`flow-${index}`">
              \{{calThreeMonth(index)}}月:<span>\{{item}}M</span>
            </li>
          </ul>
        </li>

        <li class="purchase-item hardline">
          <div class="title">
            <span class="icon-1"></span>
            <p>近三个月(\{{calThreeMonth(0)}}月-\{{calThreeMonth(2)}}月)月均消费：<span class="e-blue" v-if="!!userInfo.consumeHistory">\{{userInfo.consumeHistory.avg}}元</span></p>
            <a href="javascript:;" @click="toggleHistory('isShowConsumeHistory')" class="to-detail">详情<span class="icon-2" :class="{'e-show': isShowConsumeHistory}"></span></a>
          </div>
          <ul class="content-list" v-show="isShowConsumeHistory" v-if="!!userInfo.consumeHistory">
            <li v-for="(item, index) in userInfo.consumeHistory.list" :key="`consume-${index}`">
              \{{calThreeMonth(index)}}月:<span>\{{item}}元</span>
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import CicleLoad from '@/scripts/modules/CicleLoad';

export default {
  name: 'UserInfo',
  props: {
    userInfo: Object
  },
  data () {
    return {
      CicleLoadDom: null,
      isShowFlowHistory: false,
      isShowConsumeHistory: false
    }
  },
  computed: {
    time () {
      let nowDate = new Date();

      return `${nowDate.getFullYear()}年${nowDate.getMonth() + 1}月${nowDate.getDate()}日`;
    }
  },
  watch: {
    userInfo () {
      let _precent = this.userInfo.flow / this.userInfo.totalFlow * 100 || 0;
      if (this.CicleLoadDom.setPercent !== null) {
        this.CicleLoadDom.setPercent(_precent);
      } else {
        this.CicleLoadDom = new CicleLoad({
          canvasDom: document.getElementById('rating')
        });
        this.CicleLoadDom.setPercent(_precent);
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.CicleLoadDom = new CicleLoad({
        canvasDom: document.getElementById('rating')
      });
    });
  },
  methods: {
    //返回近三个月的中文字段
    calThreeMonth (index) {
      let nowDate = new Date(),
        nowMonth = nowDate.getMonth() + 1,
        _index = 2 - index;

      let _monthCh = (nowMonth - _index + 12) % 12;
      _monthCh === 0 && (_monthCh += 12);
      return _monthCh;
    },
    //显示隐藏历史记录
    toggleHistory (isShowHistory) {
      this[isShowHistory] = !this[isShowHistory]
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
//头部信息
.m-user-info {
  background: #5fc2ee url(./images/user_box_bg.jpg) no-repeat;
  background-size: 100% 100%;
  padding: 1px 0 0.38rem;

  .info {
    position: relative;
    margin: 0.12rem 0 0.36rem 0.16rem;
    padding-left: 0.6rem;
    height: 0.42rem;
    font-size: 0.28rem;
    color: #fff;
    line-height: 0.42rem;

    .logo {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 0.42rem;
      height: 0.42rem;
      background: url(./images/logo1.png) no-repeat;
      background-size: 100% 100%;
    }

    .time {
      position: absolute;
      top: 50%;
      right: 0.24rem;
      transform: translateY(-50%);
      color: #fff;
      font-size: .2rem;
    }
  }

  .curmeal {
    position: absolute;
    left: 0;
    top: 0.7rem;
    padding: 0 .24rem;
    font-size: .2rem;
    color: #abe6ff;
    line-height: .4rem;
    border-radius: 0 .2rem .2rem 0;
    background: #249cdd;
  }

  .desc {
    padding-top: .3rem;
    text-align: left;
    font-size: 0.24rem;
    line-height: 0.42rem;
    color: #fff;

    > div {
      width: 50%;
      float: left;
      height: 2.2rem;
    }
  }

  .sum-box {
    padding: 0.5rem 0 0 0.8rem;

    &.hardline::before {
      border-right-color: #fff;
    }
  }

  .sum,
  .flow {
    font-size: 0.5rem;
    line-height: 0.72rem;
  }

  .flow-box {
    position: relative;
    .title {
      position: absolute;
      top: 0.52rem;
      left: 50%;
      transform: translateX(-50%);
    }
    .cnt {
      position: absolute;
      top: 0.94rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .flow-data {
    margin: 0 auto;
    width: 2.5rem;
    height: 2.5rem;

    > canvas {
      width: 100%;
      height: 100%;
    }
  }
}

//消费记录
.purchase-history {
  margin-top: .12rem;
  background: #fff;

  .purchase-list {
    .title {
      position: relative;
      padding: 0 .3rem 0 .78rem;
      height: .84rem;
      font-size: .24rem;
      color: #888888;
      line-height: .84rem;



      .icon-1 {
        position: absolute;
        top: 50%;
        left: .3rem;
        width: .42rem;
        height: .42rem;
        transform: translateY(-50%);
        background: url(./images/2.png) no-repeat;
        background-size: 100% 100%;
      }

      .e-blue {
        color: #47aae0;
      }

      .to-detail {
        position: absolute;
        top: 50%;
        right: .3rem;
        color: #888888;
        transform: translateY(-50%);
      }

      .icon-2 {
        display: inline-block;
        margin: -.06rem 0 0 .1rem;
        width: .22rem;
        height: .22rem;
        vertical-align: middle;
        background: url(./images/down.png) no-repeat;
        background-size: 100% 100%;

        &.e-show {
          background: url(./images/up.png) no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .content-list {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: .2rem;
      color: #888888;
      text-align: center;
      line-height: .5rem;
      background: #c9efff;

      >li {
        flex: 1;

        &:first-child {
          padding-left: .3rem;
          text-align: left;
        }

        &:last-child {
          padding-right: .3rem;
          text-align: right;
        }

        span {
          color: #333;
        }
      }
    }
  }

  .purchase-item:not(:first-child)::before {
    border-top-color: #f3f4f5;
  }
}
</style>
