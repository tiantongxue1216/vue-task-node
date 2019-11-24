<template>
  <g
  :transform="'translate('+getCheckX(node.positionX)+','+getCheckY(node.positionY)+')'"
  :class="classes"
>
  <g transform="scale(1,1)" class="pane-scalable">
    <foreignObject :width="width" :height="height">
        <div
          ref="node"
          @contextmenu.prevent="mouseMenu"
          @mouseover="handleMouseOver"
          @mouseleave="handleMouseLeave"
        >
          <slot></slot>
        </div>
    </foreignObject>
  </g>
</g>
</template>
<script>
import mixinsTool from "../../mixins/tool";
import { truncate } from 'fs';
const prefixCls = "task-node";
export default {
  name: "Node",
  mixins: [mixinsTool],
  data() {
    return {
      store: null,
      showToolTip: false,
      nodeDom: {},
      x: 0,
      y: 0,
      initX: 0,
      initY: 0,
    };
  },
  props: {
    width: {
      type: [String, Number],
      default: 0
    },
    height: {
      type: [String, Number],
      default: 0
    },
    node: {
      id: [String, Number],
      positionX: {
        type: [String, Number],
        default: 0
      },
      positionY: {
        type: [String, Number],
        default: 0
      },
      name: {
        type: [String, Number],
        default: ''
      }
    }
  },
  computed: {
    classes() {
      return [`${prefixCls}`];
    }
  },
  mounted() {
    // let self = this
    // this.nodeDom = Snap('#'+this.node.id)
    // // this.nodeDom.drag(this.onmove,this.onstart,this.onend)
    // this.nodeDom.drag()
    // this.nodeDom.click(function(e,x,y){
    //   console.log('点击了节点', self.nodeDom.getBBox())
    // })
  },
  methods: {
    onmove(dx,dy,x,y,event) {
      // this.x = dx
      // this.y = dy
      // this.initX = this.initX + dx
      // this.initY = this.initY + dy
      // console.log('node在画布的坐标', this.nodeDom.getBBox())
      let data = {
        dx,
        dy,
        x,
        y,
        event,
        node: this.node
      }
      this.$emit("on-drag-ging", data);
    },
    onstart(x,y,event) {
      this.initX = event.clientX
      this.initY = event.clientY
      // this.$emit("on-drag-start", event, this.node);
    },
    onend(event) {
      // this.$emit("on-drag-end", event, this.node);
    },
    handleMouseOver() {
      console.log('handleMouseOver')
      this.showToolTip = true
    },
    handleMouseLeave() {
      console.log('mouvseLeave')
      this.showToolTip = false
    },
    getCheckX(X) {
      // 检查是否移出工作区
      let me = this;
      let x = X;
      if (x <= 0) {
        x = 0;
        me.node.positionX = x;
      } else if (x >= me.getBrowserHW().width) {
        x = me.getBrowserHW().width - me.width;
        me.node.positionX = x;
      }
      return x;
    },
    getCheckY(Y) {
      // 检查是否移出工作区
      let me = this;
      let y = Y;
      if (y <= 0) {
        y = 0;
        me.node.positionY = y;
      } else if (y >= me.getBrowserHW().height) {
        y = me.getBrowserHW().height - me.height;
        me.node.positionY = y;
      }
      return y;
    },
    // dragStart: function(event) {
    //   event.dataTransfer.setData("nodedata", JSON.stringify(this.node));
    //   this.$emit("on-drag-start", event, this.node);
    // },
    // dragGing: function(event) {
    //   this.$emit("on-drag-ging", event);
    // },
    // dragEnd: function(event, node) {
    //   this.$emit("on-drag-end", event, node);
    // },
    mouseMenu: function(event) {
      event.stopPropagation();
      this.$emit("on-mouse", event, this.node);
    },
    selectNodeMethod: function(event, node, ref) {
      this.$emit("on-select", event, node, ref);
    }
  },
  updated: function() {
    this.$emit("updateTem", "VDom加载完成！");
  }
};
</script>

<style lang="less">
  // .toolTip {
  //   line-height: 37px;
  //   background: rgb(255, 0, 0);
  //   width: 150px;
  //   height: 37px;
  //   position: absolute;
  // }
</style>
