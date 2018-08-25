<template>
  <transition name='f-fade'>
    <div class="dialog e-rule" @click.self.stop="!!toggleRule && toggleRule(false)" v-show=isShow>
      <div class="content">
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

        <div class="dialog-footer">
            <a @click="!!confirmAction ? confirmAction(false) : toggleRule(false)" class="btn hardline" href="javascript:;">确认</a>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'RulePop',
  props: ['isShow', 'confirmAction'],
  data () {
    return {
      ruleContent: [
        '1、抽奖获赠和包券在10个工作日内一次性赠送到账，到账后有短信提醒，通过下载和包支付APP即可在线下指定商家或线上商城消费，活动指定商户查询和下载和包APP地址可发送MMSJ到10086，商家不定期调整，具体消费规则以商家公布为准；',
        '2、和包券有效期至2018年4月30日；',
        '3、客户处于停机或转品牌未生效等非正常使用状态将无法获得和包券赠送。'
      ]
    }
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
}
.rules-list {
  font-size: .24rem;
  line-height: .32rem;
  color: $rule-text-color;
  text-align: left;
  height: 4.6rem;
  overflow-y: scroll;

  li:not(:first-child){
    margin-top: .38rem;
  }
}
</style>
