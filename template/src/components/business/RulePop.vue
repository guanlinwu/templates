<template>
  <transition name='f-fade'>
    <div class="dialog e-rule" @click.self.stop="!!toggleRule && toggleRule(false)" v-show="isShow">
      <div class="content">
        <header class="title">活动规则</header>

        <div class="messages hardline">
          <div class="rule-box" ref="scrollContainer">
            <div>
              <ul class="rules-list">
                <li v-for="(item, index) in ruleContent" :key="`rule-${index}`">
                  /{{item}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
            <a @click="!!confirmAction ? confirmAction(false) : toggleRule(false)" class="btn hardline" href="javascript:;">确认</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll';
import { mapMutations } from 'vuex';

export default {
  name: 'RulePop',
  props: ['isShow', 'confirmAction'],
  data () {
    return {
      scrollContainerObj: null,
      ruleContent: [
        '一、活动时间',
        '2018年9月21日—9月28日',
        '二、活动对象',
        '茂名移动用户',
        '三、活动奖品',
        '10G中秋流量礼包，限量5万份',
        '四、活动细则',
        '1、用户参与活动可派送10G中秋流量礼包（10份1G流量），用户本人/好友可通过派送页面获得1G流量券（国内3天，不含港澳台），每个用户限领取一次，先到先得，送完即止。',
        '2、获赠的流量券将于用户参与活动次月底前赠送至“广东移动手机营业厅”APP（6.0.1及以上版本）-首页-优惠券处，用户需在10月31日前登录APP兑换使用，逾期不兑换将自动失效。',
        '3、此流量券仅限本机使用，不能转赠他人。非茂名移动用户、4G随心王、2/3G无限量套餐、万花筒套餐、未实名换卡、限定用户可参与派送但不能获赠流量券。',
        '4、若发现作弊行为，我司可取消其获赠资格，不作任何补偿。'
      ]
    }
  },
  updated () {
    console.log('updated rule com')
    this.$nextTick(function() {
      if (!this.scrollContainerObj) {
        this.scrollContainerObj = new BScroll(this.$refs.scrollContainer, {
          // click: true,
          scrollY: true,
          fade: true
        });
      }
    })
  },
  mounted () {

  },
  methods: {
    ...mapMutations([
      'toggleRule'
    ]),
    close () {
      this.toggleRule()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$rule-text-color: #888;
.rule-box {
  margin: 0 auto;
  height: 4.6rem;
  overflow: hidden;
}
.rules-list {
  font-size: .24rem;
  line-height: .32rem;
  color: $rule-text-color;
  text-align: left;

  li:not(:first-child){
    margin-top: .14rem;
  }
}
</style>
