<template>
  <g width="100" height="100" style="outline: 2px solid #0f0" transform="translate(0,0)">
    <in-port  v-for="(item,index) in in_ports" :pid="item.id" :type="item.type" v-on:on-add-path='addPath' :isConnected = item.isConnected :key="index"></in-port>
  </g>
</template>
<script>
import InPort from '../../port/inport.vue'
const prefixCls = 'task-in-common-ls'
export default {
  components: {InPort},
  name: 'InCommonLs',
  props: {
    in_ports: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  computed: {
    classes () {
      return [
        `${prefixCls}`
      ]
    },
    wrapCls () {
      return [
        `${prefixCls}-wrap`
      ]
    },
    portNum () {
      return this.in_ports.length
    }
  },
  methods: {
    addPath: function (event, src_port_ID, dst_port_ID) {
      console.log('触发了incommonls中的addPath事件', event, src_port_ID, dst_port_ID)
      this.$emit('on-add-path',event, src_port_ID, dst_port_ID)
    }
  }
}
</script>
