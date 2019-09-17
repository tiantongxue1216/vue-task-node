<template>
  <g>
    <circle :r="r" :cx="cx" cy="0" :stroke="stroke" :stroke-width="stroke_width" :fill="fill" :id="'_'+pid"></circle>
  </g>
</template>
<script>

export default {
  name: 'InPort',
  data () {
    return {
      r: 4,
      stroke: '#808080',
      fill: '#fff',
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
    },
    isConnected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    src_port_ID() {
      return this.$store.getters.getSrcPortId
    },
    src_port_type() {
      return this.$store.getters.getSrcPortType
    },
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
    let port = Snap('#' + '_'+this.pid)
    port.mouseup(function(e,x,y) {
      self.r = 4
      self.stroke_width = 1
      self.stroke = "#808080"
      self.$store.commit('setIfReload')
      self.$emit('on-add-path',e,self.src_port_ID,self.pid)
    })
    port.hover(function() {
      self.r = 6
      self.stroke_width= 4
      if(self.src_port_type == self.type && !this.isConnected) {
        self.stroke = '#009E49'
      }else {
        self.stroke = '#E40000'
      }
    },function() {
        self.r = 4
        self.stroke_width = 1
        self.stroke = '#808080'
      }
    )
  }
}
</script>
