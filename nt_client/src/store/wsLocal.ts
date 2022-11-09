// 本地websocket服务状态管理
import { defineStore } from "pinia"
import { EnWsAction } from "@/common/enums/EnWsAction";
import WsMessage from "@/common/model/WsMessage"
export const useWsLocalStore = defineStore("wsLocal", {
    state: () => {
        return {
            wsData: WsMessage,
        }
    },
    getters: {

    },
    actions: {
        updateWsMsg(action: EnWsAction, state: number, msg: any) {
            this.wsData = new WsMessage(action, state, msg)
        }
    }
})