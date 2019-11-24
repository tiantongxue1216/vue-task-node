import { start } from "pretty-error";

const state = {
  testfocus: false,
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
  edge_data: {
    Mxy: {
      x: 0,
      y: 0
    },
    Txy: {
      x: 0,
      y: 0
    },
    isShow: false,
    dotted: false,
    ptype: 'Q'
  },
  src_port_ID: '',//当前连线的源锚点id
  src_port_type: 0,
  ifReload: false,
  node_can_move: true,//节点是否可以移动,
  node_is_moving: false,//节点正在移动
  port_drag_end: false,//是否添加了边

}
const getters = {
  getTestfocus () {
    return state.testfocus
  },
  getViPathingData () {
    return state.vi_pathing_data
  },
  getViConfig () {
    return state.vi_config
  },
  getCurrPortStart() {
    return state.curr_portStart
  },
  getSrcPortId() {
    return state.src_port_ID
  },
  getEdgeData() {
    return state.edge_data
  },
  getIfReload() {
    return state.ifReload
  },
  getNodeCanMove()  {
    return state.node_can_move
  },
  getSrcPortType() {
    return state.src_port_type
  },
  getPortDragEnd() {
    return state.port_drag_end
  },
  setNodeIsMoving() {
    return state.node_is_moving
  }

}
const mutations = {
  setTestfocus(state, data) {
    state.testfocus = !state.testfocus
  },
   //new
  setEdgeData(state, data) {
    state.edge_data = data
  },
  setSrcPortId(state, data) {
    state.src_port_ID = data
  },
  setIfReload(state) {
    state.ifReload = !state.ifReload
  },
  setNodeCanMove(state, data) {
    state.node_can_move = data
  },
  setSrcPortType(state, data) {
    state.src_port_type = data
  },
  setPortDragEnd(state, data) {
    state.port_drag_end = data
  },
  setNodeIsMoving (state, data) {
    state.node_is_moving = data
  },

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
