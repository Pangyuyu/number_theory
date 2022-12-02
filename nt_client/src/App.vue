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
import Logger from "@/common/logger/logger";
import { useWindowStore } from "@/store/window"
import SysConst from "./common/model/SysConst";
const log = new Logger("App.vue")
const router = useRouter();
const locale = ref(zhCn)
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const windowStore = useWindowStore()
var resizeTimer = null
onBeforeMount(() => {
  window.addEventListener('resize', windowResizeHandler)
})
onBeforeUnmount(() => {
  log.debug("==onBeforeUnmount==")
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
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
