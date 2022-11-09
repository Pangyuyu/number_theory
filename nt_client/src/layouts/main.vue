<template>
  <div style="overflow: hidden;">
    <!-- main主体 -->
    <div class="main">
      <!-- content页面内容 -->
      <div class="content">
        <div class="pagec">
          <router-view v-slot="{ Component }">
            <transition>
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeMount,
  watch,
} from "vue";
import {useMenuStore} from "@/store/menu"
import Logger from "@/common/logger/logger";
export default defineComponent({
  name: "Main",
  setup() {
    const log = new Logger("main.vue");
    const active = ref<string>(""); // 左侧菜单默认选中项
    const menuStore=useMenuStore()
    const isCollapse = ref<boolean>(false) //是否水平折叠菜单
    const menuList = ref(new Array())
    const menuDefaultActive=ref("home")
    // 返回数据
    return {
      active,
      isCollapse,
      menuList,
      menuDefaultActive,
    };
  },
});
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 210px;
}
</style>
<style lang="scss" scoped>
@import "@/styles/var.scss";
@import "@/styles/color.scss";
.child-rootview {
  height: calc(100% - #{$titleBarHeight});
  max-height: cacl(100% - #{$titleBarHeight});
  padding: 5px;
  overflow: hidden;
}

.main {
  height: 100vh;
  display: flex;
  .menu{
    width: auto;
    background-image: linear-gradient(to bottom, hsl(219, 74%, 26%), $color_CornflowerBlue);
  }
  .content {
    width: 100%;
    .pagec {
      overflow-y: auto;
      height: 100vh; //模块主显示区域的高度
      margin: 0;
    }
  }
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.4s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.comp_icon{
  width: 18px;
  height: 18px;
}

</style>
