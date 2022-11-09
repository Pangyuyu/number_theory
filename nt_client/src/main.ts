import { createApp } from "vue";
import App from "@/App.vue";
import Logger, { EnLogLevel } from "@/common/logger/logger";
import Router from "@/router";
import { createPinia } from 'pinia'
import "@/common/beforeRouter";
import ApiLocal from "@/common/net/public/ApiLocal";
import "@/styles/main.scss"; //重置样式
import 'default-passive-events'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

if (import.meta.env.MODE === "release") {
  Logger.setGlobalLevel(EnLogLevel.INFO);
} else {
  Logger.setGlobalLevel(EnLogLevel.DEBUG);
}
const pina = createPinia()
const app = createApp(App);
app.use(Router);//注册路由
app.use(pina);//注册状态相应组件
//注册Element-plus中的图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


// 全局自定义属性
declare module '@vue/runtime-core'{
  interface ComponentCustomProperties {
    /**
     * 全局属性：本地API
     */
    $APILOCAL: typeof ApiLocal;
  }
}
// 挂载API
app.config.globalProperties.$APILOCAL=ApiLocal;
app.mount("#app");
