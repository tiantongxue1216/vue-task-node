<template>
  <div id="app">
    <div class="hello" style="text-align: center">
      <div class="node-model cell-left">
        <ul>
          <li
            style="border-bottom: 2px solid aliceblue;"
            v-for="nodeM in nodeModels"
            :key="nodeM.id"
          >
            <task-node-model :node="nodeM">
              <span class="task-node-model-label">{{nodeM.name}}</span>
            </task-node-model>
          </li>
        </ul>
      </div>
      <div class="cell-right">
        <task-work-area
          width="100%"
          height="100%"
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
  </div>
</template>

<script>
import { truncate, truncateSync } from 'fs';
export default {
  name: "App",
  data() {
    return {
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
          positionX: 115,
          positionY: 180,
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
          positionY: 420,
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
          positionX: 720,
          positionY: 220,
          status: 'TASK_STATE_RUNNING',
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
      paths: []
    };
  },
  methods: {
    //节点和锚点事件
    handleNodeStartMove(data) {
      console.log('app拖动开始')
      this.node_start_move_info = {
        id: data.node.id,
        positionX: event.clientX,
        positionY: event.clientY
      }
    },
    handleNodeMove(moveData) {
      console.log('app拖动中')

    },
    handleNodeMoveEnd(data) {
      console.log('app拖动结束')
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
      console.log('addpath事件触发后',this.paths)
    },
    handleNodeMouseRightClick: function(event, node) {
      console.log("节点右击事件", event, node);
    },

    //连线事件
    handlePathMouseRightClick(event, portData) {
      console.log("鼠标右击路径事件", event, portData);
    },
    handlePathMouseEnter(event, portData) {
      console.log(
        "鼠标划入路径事件",
        event,
        portData
      )
    },
    handlePathMouseLeave(event, portData) {
      console.log(
        "鼠标划出路径事件",
        event,
        portData
      );
    },
    handlePathClick: function(event, portData) {
      console.log("鼠标左击路径事件", event, portData)
    },

    //工作区事件
    handleAreaMouseRightClick: function(event, id) {
      console.log("mouseMenu", "on-mouse", "工作区右击事件", event, id);
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
    mouseWheel(event, data) {},
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
      console.log("updateCompleted!!");
      // 重新加载路径
      this.$refs.curve.vReload();
    },
  }
};
</script>

<style lang="less">
.node-model {
  background-color: #eee;
  width: 140px;
  height: 500px;
}
.cell-left {
  float: left;
}
.cell-fight {
  float: left;
}
.demo-line {
  width: 140px;
  height: 26px;
  border: none;
}
.demo-btn {
  width: 48%;
  background-color: #fff;
  border: 1px solid #eee;
  font-size: 14px;
  line-height: 26px;
  cursor: pointer;
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
