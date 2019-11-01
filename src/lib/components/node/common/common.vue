<template>
  <g :id="'_' + node.id" :transform="'translate('+node.positionX+','+node.positionY+')'">
    <foreignObject width="117" height="26">
      <div
        @contextmenu.prevent="handleNodeRightClick"
        @mouseenter="handleNodeMouseEnter"
        @mouseleave="handleNodeMouseLeave"
        @drag="dragGing($event)"
        @dragstart="dragStart($event)"
        @dragend="dragEnd($event)"
        draggable="true"
        @click.stop="handleNodeSelect($event,node,$refs.node)"
        width="117"
        height="26"
        ref="node"
        :class="classes">
        <!-- <span :class="iconCls +' '+ [node.icon ? node.icon : 'task-icon-53']"></span> -->
        <span :class="nameCls" ref="name">{{node.name}}</span>
        <span :class="statusCls +' '+ stateCls(node.status)"></span>
      </div>
    </foreignObject>
    <in-port v-for="(item,index) in node.inPorts" :pid="item.id" :type="item.type" :typeId="item.typeId" :portNum="node.inPorts.length" v-on:on-add-path='addPath' :isConnected = "item.isConnected" :key="'in'+ '_' + index"></in-port>
    <out-port v-for="(item, index) in node.outPorts" :pid="item.id" :type="item.type" :typeId="item.typeId" :portNum="node.outPorts.length" :key="'out'+ '_' + index"></out-port>
  </g>
</template>

<script>
import InPort from "../../port/inport.vue";
import OutPort from "../../port/outport.vue";

const prefixCls = "task-common-node";
export default {
  components: {
    OutPort,
    InPort,
  },
  name: "CommonNode",
  data() {
    return {
      state: "",
      edge_data: {
        Mxy: {},
      },
      x: 0,
      y: 0,
    };
  },
  props: {
    node: {
      id: [String, Number],
      name: {
        type: [String, Number],
        default: "节点"
      },
      positionX: {
        type: [String, Number],
        default: 0
      },
      positionY: {
        type: [String, Number],
        default: 0
      },
      icon: [String, Number],
      status: {
        type: [String, Number],
        default: "ready"
      },
      inPorts: {
        type: Array,
        default: []
      },
      outPorts: {
        type: Array,
        default: []
      },
      isRunning: {//控制路径执行时候路径上的node变高亮
        type: Boolean,
        default: false
      }
    },
    isRunningWatcher: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return [`${prefixCls}`];
    },
    iconCls() {
      return [`${prefixCls}-icon`];
    },
    nameCls() {
      return [`${prefixCls}-name`];
    },
    statusCls() {
      return [`${prefixCls}-status`];
    },
    // selectedCls() {
    //   return [`task-node-selected`];
    // },
    //正在执行的样式
    isRunningCls() {
      return [`${prefixCls}-isRunning`]
    },
    node_can_move() {
      return this.$store.getters.getNodeCanMove
    },
  },
  watch: {
    isRunningWatcher(value) {
      let node = this.$refs.node
      if(value && this.node.isRunning) {
          node.classList.add(this.isRunningCls)
      }else {
          node.classList.remove(this.isRunningCls)
        console.log('isRunningWatcher is false')
      }
    },
    showTooltip(value) {
    }
  },
  updated: function() {
    this.$emit("updateTem", "VDom加载完成！");
  },
  mounted() {

    let self = this
    let nodeDom = Snap('#' + '_' + this.node.id)
    nodeDom.click(function(){
      console.log('点击了节点', nodeDom.getBBox())
    })
    // nodeDom.drag(this.nodeOnmove, this.nodeOnstart, this.nodeOnend)
    // nodeDom.mouseup(function() {
    //   self.$store.commit('setIfReload')
    // })
  },
  methods: {
     dragStart: function(event) {
      console.log('33333333',this.node)
      let data = {
        event,
        node: this.node
      }
      // this.$store.commit('setIfReload')
      this.$emit('on-node-move-start', data)
    },
    dragGing: function(event) {
      this.$emit('on-node-move', event)
    },
    dragEnd: function(event) {
      console.log('拖动结束')
      // if(this.node_can_move) {
        let data = {
          event,
          node: this.node
        }
        this.$emit('on-node-move-end',data)
        this.$store.commit('setIfReload')

      // }
    },

    handleNodeSelect(event, node, ref) {
      console.log('节点被选中')
      this.$emit("on-node-select", event, node, ref)
    },
    handleNodeRightClick(event) {
      console.log('鼠标右击节点',event)
      this.$emit("on-node-mouse-right-click", event, this.node)
    },
    handleNodeMouseEnter(event) {
      console.log('mouse enter', event)
      this.$emit("on-mouse-enter", event)
    },
    handleNodeMouseLeave(event) {
      console.log('mouse leave',event)
      this.$emit("on-mouse-leave", event)
    },
    // nodeOnstart() {
    //   console.log('节点开始拖动')
    //   let nodeDom = Snap('#'+'_' + this.node.id)
    //   let x = nodeDom.getBBox().x
    //   let y = nodeDom.getBBox().y
    //   let startMoveData = {
    //     node: this.node,
    //     x: x,
    //     y: y
    //   }
    //   this.$store.commit('setIfReload')
    //   this.$emit('on-node-move-start', startMoveData)
    // },
    // nodeOnmove(dx, dy, x, y, event) {
    //   if(this.node_can_move) {
    //     let moveData = {
    //       node: this.node,
    //       dx,
    //       dy
    //     }
    //     // this.$store.commit('setIfReload')
    //     this.$store.commit('setIfReload')
    //     this.$emit('on-node-move', moveData)
    //   }
    // },
    // nodeOnend() {
    //   this.$store.commit('setIfReload')
    //   this.$emit('on-node-move-end',event)
    // },
    stateCls(value) {
      switch (value) {
        case "TASK_STATE_COMPLETED":
          return "task-icon-success";
        case "TASK_STATE_RUNNING":
          return "task-icon-running";
        case "TASK_STATE_READY":
          return "task-icon-waiting";
        case "TASK_STATE_ERROR":
          return "task-icon-failed";
        case "TASK_STATE_NOTCONFIG":
          return "task-icon-notConfig"
        default:
          return "";
      }
    },
//锚点的事件
    addPath: function (event, src_port_ID, dst_port_ID) {
      this.$emit('on-add-path',event, src_port_ID, dst_port_ID)
    },
     // getCheckX(X) {
    //   // 检查是否移出工作区
    //   let me = this;
    //   let x = X;
    //   if (x <= 0) {
    //     x = 0;
    //     me.node.positionX = x;
    //   } else if (x >= me.getBrowserHW().width) {
    //     x = me.getBrowserHW().width - me.width;
    //     me.node.positionX = x;
    //   }
    //   return x;
    // },
    // getCheckY(Y) {
    //   // 检查是否移出工作区
    //   let me = this;
    //   let y = Y;
    //   if (y <= 0) {
    //     y = 0;
    //     me.node.positionY = y;
    //   } else if (y >= me.getBrowserHW().height) {
    //     y = me.getBrowserHW().height - me.height;
    //     me.node.positionY = y;
    //   }
    //   return y;
    // },
  }
};
</script>

<style lang="less" scoped>
</style>

