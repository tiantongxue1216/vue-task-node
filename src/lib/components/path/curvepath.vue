<template>
  <g ref="gss">
    <template v-if="con.length > 0" v-for="(item,index) in con">
      <t-line :key="index" :portData="item" :isSelected="(findIndexOfPath(selectedPaths,item) !== -1) ? true : false" v-on:on-path-mouse-right-click="handlePathMouseRightClick" v-on:on-path-mouse-enter="handlePathMouseEnter" v-on:on-path-mouse-leave="handlePathMouseLeave" v-on:on-path-click="handlePathClick">
      </t-line>
    </template>
      <t-line v-if="edgeData.isShow" :portData="edgeData">
      </t-line>
  </g>
</template>
<script>
import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
import TLine from './tline.vue'
import { Z_VERSION_ERROR } from 'zlib'
export default {
  components: {TLine},
  name: 'CurvePath',
  props: {
    paths: {
      type: Array
    },
    areaid: [String, Number],
    clearSelectedPaths: false,
  },
  data () {
    return {
      con: [],
      selectedPaths: [],//选中的path
      deleteIsDown: false,
      shiftIsDown: false,
      ctrlIsDown: false,
    }
  },
  watch: {
    paths (newData, oldData) {
      this.vReload()
    },
    ifReload(val) {
      this.vReload()
    },
    clearSelectedPaths(value) {
      if(value) {
        this.selectedPaths = []
      }
    },
  },
  computed: {
    //new
    edgeData() {
      let edgeData = this.$store.getters.getEdgeData
      return edgeData
    },
    IsShiftOrCtrDown: function () {
      return this.shiftIsDown || this.ctrlIsDown
    },
    ifReload() {
      return this.$store.getters.getIfReload
    }
  },
  mounted: function () {
    this.vReload()
    document.addEventListener('keydown', this.checkKeyDown)
    document.addEventListener('keyup', this.checkKeyUp)
  },
  methods: {
    checkKeyDown(e) {
      let event = window.event || e
      let code = event.which || event.keyCode
      if(code === 46) {//delete
        this.deleteIsDown = true
      }
      if(code === 16) {//shift或者ctrl
        this.shiftIsDown = true
      }
      if(code === 17) {
        this.ctrlIsDown = true
      }
    },
    checkKeyUp(e) {
      let event = window.event || e
      let code = event.which || event.keyCode
      if(code === 46) {
        this.deleteIsDown = false
      }
      if(code === 16) {
        this.shiftIsDown = false
      }
      if(code === 17) {
        this.ctrlIsDown = false
      }
    },
    vReload () {
      let self = this
      this.con = []
      this.paths.forEach((o) => {
        let vstart = Snap('#' + '_' + o.startPort)
        let vend = Snap('#' + '_' + o.endPort)
        if (vend && vstart) {
          let obj = self.computeXY(vstart, vend, false)
          if (o.dotted) {
            obj.dotted = o.dotted
          }
          if (o.ptype) {
            obj.ptype = o.ptype
          }
          obj.startPort = o.startPort
          obj.endPort = o.endPort
          obj.id = o.id
          self.con.push(obj)
        }
      })
    },
    computeXY (vstart, vend, isBing) {
      let scaling = this.$store.getters.getViConfig.scaling
      let obj = {}
      obj = {
        Mxy: {
          x: vstart.parent().parent().getBBox().x + vstart.parent().getBBox().x + (5 * scaling.ZoomX),
          y: vstart.parent().parent().getBBox().y + vstart.parent().getBBox().y + (5 * scaling.ZoomY)
        },
        Txy: {
          x: vend.parent().parent().getBBox().x + vend.parent().getBBox().x + (5 * scaling.ZoomX) - 1,
          y: vend.parent().parent().getBBox().y + vend.parent().getBBox().y + (5 * scaling.ZoomY)
        }
      }
      return obj
    },
    // clearPreviousPath() {

    // },
    handlePathClick (event, portData) {
      if(this.IsShiftOrCtrDown) {
        this.selectedPaths.push(portData)
      }else {
        this.selectedPaths = []
        this.selectedPaths[0] = portData
      }
      this.$emit('on-path-click', event, portData)
    },
    handlePathMouseRightClick (event, portData) {
      this.$emit('on-path-mouse-right-click', event, portData)
    },
    handlePathMouseEnter (event, portData) {
      this.$emit('on-path-mouse-enter', event, portData)
    },
    handlePathMouseLeave (event, portData) {
      this.$emit('on-path-mouse-leave', event, portData)
    },

    //判断当前path在selectedPaths中index
    findIndexOfPath(selectedPaths, currPath) {
      let resIndex = -1
      for(let index in selectedPaths) {
        if((selectedPaths[index].startPort === currPath.startPort) && (selectedPaths[index].endPort === currPath.endPort)) {
          resIndex = index
          break
        }
      }
      return resIndex
    }

  }
}
</script>
