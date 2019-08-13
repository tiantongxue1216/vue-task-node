<template>
  <g ref="gss">
    <template v-if="con.length > 0" v-for="(item,index) in con">
      <t-line :key="index" :portData="item" :isSelected="(findIndexOfPath(selectedPaths,item) !== -1) ? true : false" v-on:on-mouse="mouseFn" v-on:on-mouse-over="mouseOverFn" v-on:on-mouse-out="mouseOutFn" v-on:on-click="clickFn">
      </t-line>
    </template>
      <t-line v-if="path.isShow" :portData="path">
      </t-line>
  </g>
</template>
<script>
import TLine from './tline.vue'
import { format } from 'util';
import { fail } from 'assert';
import { truncate } from 'fs';
export default {
  components: {TLine},
  name: 'CurvePath',
  props: {
    paths: {
      type: Array
    },
    areaid: [String, Number]
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
    }
  },
  computed: {
    path: function () {
      let pa = this.$store.getters.getViPathingData
      let isShow = pa.isShow
      if (pa.Mxy) {
        pa = this.computeXY(pa.Mxy, pa.Txy, true)
      }
      pa.isShow = isShow
      pa.dotted = this.$store.getters.getViConfig.isDotted
      pa.ptype = this.$store.getters.getViConfig.lineType
      return pa
    },
    IsShiftOrCtrDown: function () {
      return this.shiftIsDown || this.ctrlIsDown
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
      let me = this
      this.con = []
      this.paths.forEach((o) => {
        let vstart = document.getElementById(o.startPort)
        let vend = document.getElementById(o.endPort)
        if (vend && vstart) {
          let obj = me.computeXY(vstart, vend, false)
          if (o.dotted) {
            obj.dotted = o.dotted
          }
          if (o.ptype) {
            obj.ptype = o.ptype
          }
          obj.startPort = o.startPort
          obj.endPort = o.endPort
          me.con.push(obj)
        }
      })
    },
    computeXY (vstart, vend, isBing) {
      let area = document.getElementById(this.areaid)
      let scaling = this.$store.getters.getViConfig.scaling
      let obj = {}
      if (isBing) {
        obj = {
          Mxy: {
            x: vstart.x - area.getBoundingClientRect().left,
            y: vstart.y - area.getBoundingClientRect().top
          },
          Txy: {
            x: vend.x - area.getBoundingClientRect().left,
            y: vend.y - area.getBoundingClientRect().top
          }
        }
      } else {
        obj = {
          Mxy: {
            x: vstart.getBoundingClientRect().left - area.getBoundingClientRect().left + (5 * scaling.ZoomX),
            y: vstart.getBoundingClientRect().top - area.getBoundingClientRect().top + (5 * scaling.ZoomY)
          },
          Txy: {
            x: vend.getBoundingClientRect().left - area.getBoundingClientRect().left + (4 * scaling.ZoomX),
            y: vend.getBoundingClientRect().top - area.getBoundingClientRect().top + 0
          }
        }
      }
      return obj
    },
    clickFn (event, portData) {
      if(this.IsShiftOrCtrDown) {
        this.selectedPaths.push(portData)
      }else {
        this.selectedPaths = []
        this.selectedPaths[0] = portData
      }
      this.$emit('on-click', event, portData)
    },
    mouseFn (event, portData) {
      this.$emit('on-mouse', event, portData)
    },
    mouseOverFn (event, portData) {
      this.$emit('on-mouse-over', event, portData)
    },
    mouseOutFn (event, portData) {
      this.$emit('on-mouse-out', event, portData)
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
