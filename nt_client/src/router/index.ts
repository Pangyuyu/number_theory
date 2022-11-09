import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import home from "./modules/home";
// import Logger from '@/common/logger/logger';
const routes: Array<RouteRecordRaw> = [
  home,
  // **********404**********
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import("@/layouts/error.vue").catch(() => {}),
  },
];

const Router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default Router;
