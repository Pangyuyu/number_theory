import Router from '@/router/index'
import Logger from '@/common/logger/logger'
const log=new Logger("beforeRouter.ts")
// 路由拦截
Router.beforeEach((to: any, form: any, next: any) => {
    next();
})