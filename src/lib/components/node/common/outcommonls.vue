<template>
  <g width="100" height="100" style="outline: 2px solid #f0f" transform="translate(0,25)">
    <out-port v-for="(item, index) in out_ports" :pid="item.id" :type="item.type" :key="index" :portNum="portNum"></out-port>
  </g>
</template>
<script>
import OutPort from '../../port/outport.vue'
const prefixCls = 'task-out-common-ls'
export default {
  components: {
    OutPort
  },
  name: 'OutCommonLs',
  props: {
    out_ports: {
      type: Array
    },
  },
  data () {
    return {
    }
  },
  mounted() {
    console.log('outports', this.out_ports)
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
      return this.out_ports.length
    }
  }
}
</script>
