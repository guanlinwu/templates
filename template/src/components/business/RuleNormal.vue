<template>
  <transition name='f-fade'>
    <div class="rule-normal">
      <header class="title">活动规则</header>
        <div class="messages hardline">
          <div class="rule-box">
            <ul class="rules-list">
              <li v-for="(item, index) in ruleContent" :key="`rule-${index}`">
                \{{item}}
              </li>
            </ul>
          </div>
        </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'RuleNormal',
  data() {
    return {
      ruleContent: [
        '1、会员日当天，您通过本页面成功参与“点赞”征集服务活动，即可获得2G省内通用流量快餐赠送（有效期4小时），仅限当天前5000名客户参与。',
        '2、每人当月仅限享受一次活动优惠；',
        '3、流量券即时赠送到账，需在7月20日前登录广东移动手机营业厅APP首页-优惠券进行兑换。',
        '4、未换4G卡、未实名登记、4G随心王、无限量套餐、万花筒套餐客户、和多号副号、非正常使用的号码将不能获得赠送。'
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$rule-text-color: #888;

.rule-normal {
  .title {
    position: relative;
    margin-top: 0.1rem;
    font-size: 0.24rem;
    color: #333333;
    line-height: 0.78rem;

    &::after,
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      width: 0.7rem;
      transform: translateY(-50%) scaleY(0.5);
      height: 1px;
      background: #333;
    }

    &::after {
      right: 1.6rem;
    }
    &:before {
      left: 1.6rem;
    }
  }
  .rule-box {
    margin: 0 auto;
    padding: 0 .66rem .26rem;
  }
  .rules-list {
    font-size: 0.24rem;
    line-height: 0.32rem;
    color: $rule-text-color;
    text-align: left;

    li:not(:first-child) {
      margin-top: 0.1rem;
    }
  }
}
</style>
