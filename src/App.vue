<template>
  <div id="app">
      <div class="node-model">
        <ul style="list-style:none">
          <li
            style="border-bottom: 2px solid aliceblue;list-style:none"
            v-for="nodeM in nodeModels"
            :key="nodeM.id"
          >
            <task-node-model :node="nodeM">
              <span class="task-node-model-label">{{nodeM.name}}</span>
            </task-node-model>
          </li>
        </ul>
      </div>
      <div class="cell-right" id="workAreaCon">
        <task-work-area
          :width="width"
          :height="height"
          :id="work_id"
          :ini="ini_config"
          v-on:on-add-nodemodel="onAddNodeModel"
          v-on:on-area-mouse-right-click="handleAreaMouseRightClick"
          ref="area"
          v-on:on-mouse-wheel="mouseWheel"
          v-on:on-area-click="workAreaClickFn"
        >
          <task-curve-path
            :areaid="work_id"
            :paths="paths"
            :clearSelectedPaths='clearSelectedPaths'
            ref="curve"
            v-on:on-path-mouse-right-click="handlePathMouseRightClick"
            v-on:on-path-mouse-enter="handlePathMouseEnter"
            v-on:on-path-mouse-leave="handlePathMouseLeave"
            v-on:on-path-click="handlePathClick"
          ></task-curve-path>
          <template v-for="node in nodes">
            <task-common-node
              :isRunningWatcher='isRunningWatcher'
              :key="node.id"
              :node="node"
              v-on:on-node-move="handleNodeMove"
              v-on:on-node-move-start="handleNodeStartMove"
              v-on:on-node-move-end="handleNodeMoveEnd"
              v-on:on-add-path="addPath"
              v-on:on-node-select="handleNodeSelect"
              v-on:updateTem="updateCompleted"
              v-on:on-node-mouse-right-click="handleNodeMouseRightClick"
            ></task-common-node>
          </template>
        </task-work-area>
      </div>
  </div>
</template>

<script>
import { truncate, truncateSync } from 'fs';
export default {
  name: "App",
  data() {
    return {
      contextMenu: {
        showContextmenu: false,
        curNodeId: ""
      },
      isRunningWatcher: false,
      modelnodes: [
        {
          id: 1,
          name: "数据",
          children: [
            {
              id: 2,
              name: "node1",
              icon: "task-icon-41",
              children: []
            },
            {
              id: 3,
              name: "node2",
              icon: "task-icon-41",
              children: []
            }
          ]
        },
        {
          id: 3,
          name: "node3",
          icon: "task-icon-43",
          children: []
        }
      ],
      clearSelectedPaths:  false,
      dtl: 10,
      work_id: "work_id",
      ini_config: {
        lineType: "Q",
        isDotted: false,
        scaling: {
          ZoomX: 1,
          ZoomY: 1
        }
      },
      // startNode: {},
      node_start_move_info: {},
      nodeModels: [
        {
          id: "12",
          name: "SQL"
        },
        {
          id: "13",
          name: "WorkData"
        },
        {
          id: "14",
          name: "TableToTV"
        },
        {
          id: "15",
          name: "增加系列"
        }
      ],
      initialData: {
        id: "node4",
        name: "节点4",
        positionX: 300,
        positionY: 60,
        inPorts: [],
        outPorts: [
          {
            id: "node4_5"
          }
        ]
      },
      nodes: [
        {
          id: "node1",
          name: "节点1",
          positionX: 0,
          positionY: 0,
          status: 'TASK_STATE_RUNNING',
          inPorts: [
            {
              id: "node1_1",
              typeId: "0",
              isConnected: true
            }
          ],
          outPorts: [
            {
              id: "node1_4",
              typeId: "0"
            }
          ]
        },
        {
          id: "node2",
          name: "节点2",
          positionX: 20,
          positionY: 300,
          status: 'TASK_STATE_COMPLETED',
          inPorts: [
            {
              id: "node2_1",
              typeId: "0",
              isConnected: true
            },
            {
              id: "node2_3",
              typeId: "1",
              isConnected: false
            }
          ],
          outPorts: [
            {
              id: "node2_4",
              typeId: "0"
            },
            {
              id: "node2_5",
              typeId: "1"
            }
          ]
        },
        {
          id: "node3",
          name: "节点3",
          positionX: 340,
          positionY: 315,
          status: 'TASK_STATE_ERROR',
          inPorts: [
            {
              id: "node3_1",
              typeId: "0",
              isConnected: true
            },
            {
              id: "node3_3",
              typeId: "1",
              isConnected: false
            }
          ],
          outPorts: [
            {
              id: "node3_4",
              typeId: "0"
            }
          ]
        },
        {
          id: "node5",
          name: "节点555555555555",
          positionX: 420,
          positionY: 1000,
          status: 'TASK_STATE_READY',
          inPorts: [
            {
              id: "node5_1",
              typeId: "0",
              isConnected: true
            }
          ],
          outPorts: []
        },
        {
          id: "node6",
          name: "节点6",
          positionX: 1420,
          positionY: 740,
          status: 'TASK_STATE_NOTCONFIG',
          inPorts: [
            {
              id: "node6_1",
              typeId: "0",
              isConnected: false
            }
          ],
          outPorts: [
            {
              id: "node6_2",
              typeId: "0"
            },
            {
              id: "node6_3",
              typeId: "1"
            }
          ]
        }
      ],
      paths: [],
      curRenameNodeId: '',
      width: 0,
      height: 0,
    };
  },
  mounted() {
    let self = this
    this.setSvgWH()

    window.onresize = function() {
      self.setSvgWH()
    };
  },
  computed: {
    testfocus() {
      return this.$store.getters.getTestfocus
    },
  },
  watch: {
    testfocus() {
      console.log('watch testfocus变化了')
      this.setNodeProp(this.curRenameNodeId, 'rename', false)
    },
  },
  
  methods: {
    //节点和锚点事件
    handleNodeStartMove(data) {
      this.node_start_move_info = {
        id: data.node.id,
        positionX: event.clientX,
        positionY: event.clientY
      }
    },
    handleNodeMove(moveData) {

    },
    handleNodeMoveEnd(data) {
      let nodeXY = {};
      nodeXY.x = data.event.clientX;
      nodeXY.y = data.event.clientY;
      let me = this;
      this.nodes.forEach(function(item) {
        if (item.id === data.node.id) {
          item.positionX = data.node.positionX + (nodeXY.x - me.node_start_move_info.positionX);
          item.positionY = data.node.positionY + (nodeXY.y - me.node_start_move_info.positionY);
        }
      })
    },
    handleNodeSelect: function(event, data, node) {
      console.log("选中节点",event,data,node);
    },
    addPath: function(event, startData, endData) {
      let self = this;
      this.nodes.forEach(function(item) {
        item.inPorts.forEach(function(ins) {
          if (ins.id == endData) {
            ins.isConnected = true;
          }else  {
            ins.isConnected = false
          }
        })
        item.outPorts.forEach(function(out) {
          if (out.id == startData) {
            out.isConnected = true
          }else {
            out.isConnected = false
          }
        })
      })
      self.paths.push({
        dotted: self.ini_config.isDotted,
        ptype: self.ini_config.lineType,
        startPort: startData,
        endPort: endData
      });
    },
    handleNodeMouseRightClick: function(event, node) {
      console.log('右键点击了组件节点', node)
      this.curRenameNodeId = node.id
      this.setNodeProp(node.id, 'rename', true)
      // this.contextMenu.showContextmenu = false
      console.log('contextMenuClick', name)
    },
    //查找相应id的node并改变该node的属性
    setNodeProp(id, prop, value) {
      console.log(id,prop,value, 'setNodeProp')
      for(let node of this.nodes) {
        if(id == node.id) {
          console.log(node.id,prop, value)
          this.$set(node, prop, value);
          break
        }
      }
    },

    //连线事件
    handlePathMouseRightClick(event, portData) {
    },
    handlePathMouseEnter(event, portData) {
    },
    handlePathMouseLeave(event, portData) {
    },
    handlePathClick: function(event, portData) {
    },

    //工作区事件
    handleAreaMouseRightClick: function(event, id) {
      this.clearSelectedPaths = true
      //改变节点status
      for(let item of this.nodes) {
        if(item.id == 'node6') {
          item.status = 'failed'
        }
      }
      this.isRunningWatcher = !this.isRunningWatcher//组件在执行
      let runningPath = ['node1','node2','node3','node4']
      if(this.isRunningWatcher) {
        this.nodes.forEach((item,index) => {
        if(runningPath.indexOf(item.id) !== -1) {
          this.$set(this.nodes,index,{
            ...item,
            isRunning: true
          })
        }else {
          this.$set(this.nodes,index,{
            ...item,
            isRunning: false
          })
        }
      })
    }else {
      this.nodes.forEach((item, index) => {
        this.$set(this.nodes, index, {
          ... item,
          isRunning: false
        })
      })
    }
    },
    workAreaClickFn() {
    },
    mouseWheel(event, data) {
      console.log('滚动鼠标')
      if (event.wheelDelta > 0) {
        this.zoomIn();
      } else {
        this.zoomOut()
      }
    },
    zoomIn(event) {
      this.ini_config.scaling.ZoomX = this.ini_config.scaling.ZoomX + 0.1;
      this.ini_config.scaling.ZoomY = this.ini_config.scaling.ZoomY + 0.1;
    },
    zoomOut(event) {
      this.ini_config.scaling.ZoomX = this.ini_config.scaling.ZoomX - 0.1;
      this.ini_config.scaling.ZoomY = this.ini_config.scaling.ZoomY - 0.1;
    },
    onAddNodeModel(event, node) {
      let newNode = {};
      newNode = node;
      newNode.id = "node" + this.dtl++;
      newNode.positionX = node.positionX - 90; // -15 -90 定位到节点的终点
      newNode.positionY = node.positionY - 15;
      newNode.outPorts = [
        {
          id: newNode.id + "_" + Math.floor(Math.random() * 10)
        }
      ];
      newNode.inPorts = [];
      this.nodes.push(newNode);
    },
    updateCompleted: function() {
      // 重新加载路径
      this.$refs.curve.vReload();
    },
    setSvgWH() {
      let xArray = this.nodes.map(item => {
        return item.positionX
      })
      let yArray = this.nodes.map(item => {
        return item.positionY
      })
      let workAreaCon = document.getElementById('workAreaCon')
      if(Math.max(... xArray) + 100 <= workAreaCon.width) {
        this.width = workAreaCon.width
      }else {
        this.width = Math.max(... xArray) + 200
      }
      if(Math.max(... yArray) + 100 <= workAreaCon.height) {
        this.height = workAreaCon.height
      }else {
        this.height = Math.max(... yArray) + 100
      }

    }
  }
};
</script>

<style lang="less">
.node-model {
  display: inline-block;
  background-color: #eee;
  width: 140px;
}
.cell-right {
  display: inline-block;
  width: calc(~"100vw - 500px");
  height: calc(~"100vh - 100px");
  margin-left: 200px;
}
// @import "lib/styles/index.less";
/*#app {*/
/*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
/*-webkit-font-smoothing: antialiased;*/
/*-moz-osx-font-smoothing: grayscale;*/
/*text-align: center;*/
/*color: #2c3e50;*/
/*padding: 50px;*/
/*background-color: #cccccc;*/
/*}*/
</style>

<!--
.icon {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

[class^="icon-task"], [class*=" icon-task"] {
  font-family:"iconfont" !important;
  /* 以下内容参照第三方图标库本身的规则 */
  font-size: 18px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
