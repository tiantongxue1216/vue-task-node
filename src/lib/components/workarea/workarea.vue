<template>
  <div
    :class="classes"
    ref="svgArea"
    :style="areaStyles"
    @contextmenu.prevent="handleAreaMouseRightClick"
    @dragover.prevent
    @drop.prevent="onAddNodeModel"
    @mousewheel="onMouseWheel"
    @click="handleAreaClick"
    id="svgCon"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      :width="svgWidth"
      :height="svgHeight"
      :id="id"
    >
      <!-- <g> -->
        <g>
          <slot />
        </g>
      <!-- </g> -->
    </svg>
  </div>
</template>

<script>
import mixinsTool from "../../mixins/tool";
const prefixCls = "task-work-area";
export default {
  name: "WorkArea",
  mixins: [mixinsTool],
  data() {
    return {
      svgWidth: 1000,
      svgHeight: 500,
      scrollTop: 0,
      scrollLeft: 0,
    };
  },
  props: {
    ini: {
      lineType: {
        type: [String],
        default: "Q"
      },
      isDotted: {
        type: [Boolean],
        default: false
      },
      scaling: {
        type: [Object],
        default: { ZoomX: 1, ZoomY: 1 }
      }
    },
    width: {
      type: [String, Number],
      default: 0
    },
    height: {
      type: [String, Number],
      default: 0
    },
    id: {
      type: [String, Number]
    }
  },
  watch: {
    ini: {
      handler(newIni, oldIni) {
        this.$store.dispatch("setViConfig", newIni);
      },
      deep: true
    },
  },
  computed: {
    classes() {
      return [`${prefixCls}`];
    },
    areaStyles() {
      let style ={}
      style.background = '#f00'
      // let style = {};
      // if (this.isCssInUnit(this.width) >= 0) {
      //   style.width = this.width;
      // } else {
      //   style.width = `${this.width}px`;
      // }
      // if (this.isCssInUnit(this.height) >= 0) {
      //   style.height = this.height;
      // } else {
      //   style.height = `${this.height}px`;
      // }
      return style;
    },
  },
  mounted: function() {
    let self = this
    document.getElementById('svgCon').addEventListener('scroll', function(e) {
      self.scrollLeft = e.target.scrollLeft
      self.scrollTop = e.target.scrollTop
    })

    this.setSvgHW(self);
    window.onresize = function() {
      self.setSvgHW(self);
      // self.$root.$children[0].restoreAppEchoWindowResize();
    };
    // let svg = Snap('#'+this.id)
    // svg.drag(this.onmove,this.onstart,this.onend)
    // // svg.drag()
    // svg.click(function(e,x,y){
    //   // console.log('点击了画布', svg.getBBox(),e.clientX, e.clientY, e)
    // })
  },
  methods: {
    setSvgHW: function(me) {
      let width = this.transferCss(this.width);
      let height = this.transferCss(this.height);
      if (me.getBrowserHW().width < width) {
        me.svgWidth = width;
      } else {
        me.svgWidth = me.getBrowserHW().width;
      }
      if (me.getBrowserHW().height < height) {
        me.svgHeight = height;
      } else {
        me.svgHeight = me.getBrowserHW().height;
      }
    },

    // onmove() {

    // },
    // onstart() {

    // },
    // onend() {

    // },
    handleAreaMouseRightClick: function(event) {
      this.$emit("on-area-mouse-right-click", event, this.id);
    },
    onMouseWheel: function(event) {
      this.$emit("on-mouse-wheel", event, this.ini);
    },
    onAddNodeModel: function(event) {
      let node = event.dataTransfer.getData("nodemodel");
      let scalin = this.$store.getters.getViConfig.scaling;
      if (node) {
        let nodeObj = JSON.parse(node)
        let ref = this.$refs.svgArea
        nodeObj.positionX = event.layerX + this.scrollLeft
        nodeObj.positionY = event.layerY + this.scrollTop
        this.$emit("on-add-nodemodel", event, nodeObj);
      }
    },
    handleAreaClick(event) {
      this.$emit('on-area-click',event)
    }

  }
};
</script>
