import { start } from "pretty-error";

const state = {
  vi_pathing_data: {
    isShow: false
  },
  vi_config: {
    pathType: 'Q',
    dotted: false,
    scaling: {ZoomX: 1, ZoomY: 1}
  },
  curr_portStart: {
    pid: '',
    type: ''
  },
}
const getters = {
  getViPathingData () {
    return state.vi_pathing_data
  },
  getViConfig () {
    return state.vi_config
  },
  getCurrPortStart() {
    return state.curr_portStart
  },
}
const mutations = {
  setMViPathingData (state, name) {
    state.vi_pathing_data = name
  },
  setMViConfig (state, name) {
    state.vi_config = name
  },
  setCurrPortStart (state, name) {
    state.curr_portStart.pid = name.pid
    state.curr_portStart.type = name.type
  },
}
const actions = {
  setViPathingData ({commit, state}, name) {
    commit('setMViPathingData', name)
  },
  setViConfig ({commit, state}, name) {
    commit('setMViConfig', name)
  }
}

const store = {
  state,
  getters,
  mutations,
  actions
}
export default store
