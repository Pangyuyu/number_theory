// 面包屑的data类型
interface CrumbsDataType {
    router?: any,
    route?: any,
    routerList:Array<ROUTER_LIST>
    children: Array<ROUTER_LIST>,
    jumpRouter: (path: string) => void
}

// 路由列表
interface ROUTER_LIST {
    path: string,
    title: string,
}