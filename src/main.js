import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import {TaskNode, TaskNodeStore} from './lib/index'
// import '../dist/css/vnode.css'
import './lib/styles/index.less'
// import iView from 'iview'

Vue.config.productionTip = false
Vue.use(TaskNode)
Vue.use(Vuex)
// Vue.use(iView)

const store = new Vuex.Store({
  modules: {
    TaskNodeStore
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
