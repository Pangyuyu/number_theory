<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance, ComponentInternalInstance, watch, onBeforeMount, onBeforeUnmount } from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { useRouter } from "vue-router";
import { ElConfigProvider } from "element-plus";
import Modal_app_version from "./view/dialog/modal_app_version.vue";
import Logger from "@/common/logger/logger";
import ModalTool from "./common/ui/ModalTool";
import hookWsLocal from "@/common/net/guestin-wss/WsLocalCore"
import { useWsLocalStore } from "@/store/wsLocal"
import { EnWsAction } from "./common/enums/EnWsAction";
import { useWindowStore } from "@/store/window"
import SysConst from "./common/model/SysConst";
const { WsPort, WebSocketStart, WsDestory,WsResetPort } = hookWsLocal()
const log = new Logger("App.vue")
const router = useRouter();
const locale = ref(zhCn)
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const windowStore = useWindowStore()
const wsStateStyle = ref("ws-state-normal")
const wsStateMsg=ref("本地服务未连接")
var resizeTimer = null
onBeforeMount(() => {
  window.addEventListener('resize', windowResizeHandler)
})
onBeforeUnmount(() => {
  log.debug("==onBeforeUnmount==")
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
  WsDestory()
  window.removeEventListener('resize', windowResizeHandler)
})

onMounted(async () => {
  const mainDebug = await window.EPre.appIsDebug()
  // log.debug("onMounted isDebug", mainDebug)
  //如果主进程不是debug版本，则此变量一定要设置为false,防止打包错误。
  if (!mainDebug.data.isDebug) {
    SysConst.DEBUG = false
  }
  regMainProcessEvents()
  // setTimeout(() => {
  //   if (SysConst.DEBUG) {
  //     //本地调试状态，只用于
  //     WsResetPort(SysConst.DEBUG_PORT)
  //     WebSocketStart()
  //     return
  //   }
  //   initLocalServer()
  // }, 500)
});
//注册主进程主动发出的事件
function regMainProcessEvents() {
  window.EPre.onMenuAction((event, value) => {
    if (value.action) {
      if (value.action == "login") {
        router.replace({ path: "/home/index" })
      }
    }
  })
}

/**
 * 检测并启动本地服务
 */
async function initLocalServer() {
  const stateRes = await window.EPre.localServerState()
  // log.debug("检测本地服务结果", stateRes)
  if (stateRes.isFail) {
    localServerStart()
    return
  }
  if (!stateRes.data.isRunning) {
    localServerStart()
  }
  proxy.$APILOCAL.setLocalPort(stateRes.data.port)
  wsStart()
}
async function localServerStart() {
  const startRes = await window.EPre.localServerStart()
  // console.log("本地服务启动返回", startRes)
  if (startRes.isFail) {
    ModalTool.ShowToast("本地服务启动失败!\n" + startRes.message, "warning")
    return
  }
  proxy.$APILOCAL.setLocalPort(startRes.data.port)
  WsResetPort(startRes.data.port)
  ModalTool.ShowToast("本地服务已启动", "success")
  wsStart()
}

async function wsStart() {
  const lsPortRes = await window.EPre.localServerPort()
  if (lsPortRes.isFail) {
    ModalTool.ShowToast(lsPortRes.message, "warning")
    return
  }
  WebSocketStart()
}

const wsLocalStore = useWsLocalStore()
watch(() => wsLocalStore.wsData, (_new: any, _old) => {
  caclWsStyle(_new.action)
  switch (_new.action) {
    case EnWsAction.ReceiveMsg: {
      // if (SysConst.DEBUG) {
      //   const data = _new.data
      //   log.debug("EnWsAction.ReceiveMsg", data)
      // }
    } break;
    case EnWsAction.Open:
      proxy.$APILOCAL.setLocalPort(WsPort() + "")
      break;
    case EnWsAction.Close:
      proxy.$APILOCAL.setLocalPort(WsPort() + "")
      break;
    default: {
      // log.debug(_new)
    } break
  }
})
function windowResizeHandler(event) {
  if (!document.hidden) {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
    resizeTimer = setTimeout(() => {
      windowStore.changeSize(event.target.innerWidth, event.target.innerHeight)
    }, 200)
  }
}
function caclWsStyle(wsState: EnWsAction) {
  switch (wsState) {
    case EnWsAction.Connect:
    case EnWsAction.ReceiveMsg:
    case EnWsAction.Open:
      wsStateStyle.value = "ws-state-conn"
      wsStateMsg.value="本地服务连接正常"
      break
    case EnWsAction.Close:
    case EnWsAction.Error:
      wsStateStyle.value = "ws-state-error"
      wsStateMsg.value="本地服务连接已断开"
      break
    case EnWsAction.Reconnect:
      wsStateStyle.value = "ws-state-conning"
      wsStateMsg.value="尝试重新连接..."
      break
    default: wsStateStyle.value = "ws-state-normal"
      break
  }
}
</script>
<style>
.xing-tabs>.el-tabs__content {
  padding-left: 32px;
  padding-left: 32px;
  font-size: 32px;
  font-weight: 600;
}

.xing-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}

.xing-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
<style lang="scss">
@import "@/styles/scrollbar.scss";
@import "@/styles/main.scss";

.versionstyle {
  position: fixed;
  right: 10px;
  bottom: 10px;
  color: black;
  height: 25px;
  z-index: 10;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pane-page {
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
    height: calc(100vh - 10px);

    .query {
        height: 46px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #8b8a8a;
    }

    .echarts {
        width: 99%;
        height: 100%;
        margin: 10px;
        border-radius: 10px;
        border: 1px solid #3c3c3c;
    }
}

.title {
    font-size: 14px;
    margin-left: 10px;
    margin-right: 5px;
    color: #3c3c3c;
}
</style>
