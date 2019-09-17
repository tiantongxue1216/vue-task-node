<template>
    <g>
      <circle :r="r" :cx="cx" cy="25" :stroke-width="stroke_width" stroke="#808080" fill="#fff" :id="'_' + pid"></circle>
    </g>
</template>
<script>
import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
export default {
  name: 'OutPort',
  data () {
    return {
      Mxy: null,
      Txy: null,
      r: 4,
      stroke_width: 1,
      transformData: ''
    }
  },
  props: {
    pid: [Number, String],
    type: [Number, String],
    typeId: [Number, String],
    portNum: {
      type: [String, Number],
      default() {
        return 1
      }
    }
  },
  computed: {
    cx() {
      if(this.portNum == 0) {
        return 0
      }else if(this.portNum == 1) {
        return 58.5
      }else if(this.portNum == 2) {
        if(this.typeId == 0) {
          return 39
        }else if(this.typeId == 1) {
          return 78
        }
      }else if(this.portNum == 3) {
        if(this.typeId == 0) {
          return 29.25
        }else if(this.typeId == 1) {
          return 58.5
        }else if(this.typeId == 2) {
          return 87.75
        }
      }else if(this.portNum == 4) {
        if(this.typeId == 0) {
          return 23.4
        }else if(this.typeId == 1) {
          return 46.8
        }else if(this.typeId == 2) {
          return 70.2
        }else if(this.typeId == 3) {
          return 93.6
        }
      }
    }
  },
  mounted() {
    let self = this
    let port = Snap('#' + '_' +this.pid)
    port.drag(this.portOnmove, this.portOnstart, this.portOnend)
    port.hover(function() {
      self.r = 6
      self.stroke_width = 4
    }, function() {
      self.r = 4
      self.stroke_width = 1
    })
  },
  methods: {
    portOnstart(x, y, event) {
      this.$store.commit('setPortDragEnd', false)
      // this.$store.commit('setNodeCanMove', false)
      this.$store.commit('setSrcPortId', this.pid)
      this.$store.commit('setSrcPortType', this.type)
      let portDom = Snap('#' + '_' + this.pid)

      this.Mxy = {
        x: portDom.parent().parent().getBBox().x + portDom.parent().getBBox().x + 5,
        y: portDom.parent().parent().getBBox().y + portDom.parent().getBBox().y + 5
      }
    },
    portOnmove(dx, dy, x, y, event) {
      this.Txy = {
        x: this.Mxy.x + dx,
        y: this.Mxy.y + dy + 3.5
      }
      this.$store.commit('setEdgeData', { Mxy: this.Mxy, Txy: this.Txy, isShow: true })
    },
    portOnend(event) {
      this.$store.commit('setIfReload')
      this.$store.commit('setEdgeData', { Mxy: this.Mxy, Txy: this.Txy, isShow: false })
    },
  }
}
</script>
