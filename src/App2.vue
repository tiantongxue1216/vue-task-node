<template>
  <svg id="svg" width="500" height="500" style="outline: 5px solid #f00"></svg>
</template>

<script>
import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
export default {
  data() {
    return {
    }
  },
  mounted() {
    let svg = Snap('#svg')
    let c1 = svg.paper.circle(50,50,40).drag(this.onmove,this.onstart,this.onend)
    c1.click(function(e,x,y,z){
      console.log('点击了元素', e, x, y)
    })
  },
  methods: {
    onmove(dx,dy,x,y,event) {
      console.log('移动中',dx,dy,x,y,event)
    },
    onstart(e) {
    },
    onend() {
    }
  }
}
  </script>
