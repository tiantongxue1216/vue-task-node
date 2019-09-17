<template>
  <!-- <svg width="100" height="50" style="outline: 1px solid #f00">
    <rect width="100" height="50" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/>
  </svg> -->
    <div :class="classes" draggable="true" @dragstart='dragStart($event)'>
      <slot></slot>
    </div>
</template>
<script>
const prefixCls = 'task-node-model'
export default {
  name: 'NodeModel',
  props: {
    node: {
      id: [String, Number],
      name: {
        type: [String, Number],
        default: '节点'
      }
    }
  },
  data () {
    return {
      store: null
    }
  },
  mounted() {
    // let nodeDom = Snap('svg')
    // nodeDom.drag(this.onmove,this.onstart,this.onend)
    // nodeDom.click(function(e,x,y){
    //   console.log('点击了节点', nodeDom.getBBox())
    // })
  },
  computed: {
    classes () {
      return [
        `${prefixCls}`
      ]
    }
  },
  methods: {
    onmove() {

    },
    onstart() {

    },
    onend(){

    },
    dragStart: function (event) {
      console.log('drag start')
      event.dataTransfer.setData('nodemodel', JSON.stringify(this.node))
    }
  }
}
</script>
