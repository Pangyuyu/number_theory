/*封装本地WebSocket
需要做以下修改
1.js改为ts;
2.原先的vuex改为pinia；
*/
/*
1.web Socket状态
    0 - 表示连接尚未建立。
    1 - 表示连接已建立，可以进行通信。
    2 - 表示连接正在进行关闭。
    3 - 表示连接已经关闭或者连接不能打开。
*/
import Logger from "@/common/logger/logger";
import { useWsLocalStore } from "@/store/wsLocal"
import utils from "@/common/utils/utils";
import { EnWsAction } from "@/common/enums/EnWsAction";
import SysConst from "@/common/model/SysConst";
let wsLog = new Logger("kt-websocket-core.js")
let _PORT = SysConst.DEBUG_PORT
let WS: WebSocket = null; // webSocket对象
let WssInterval = null;//为websocket重连时，创建的setInterval对象
export default function () {
    let __HeartbeatTime = 1000 * 5; // 10秒一次心跳
    let __CLOSE_REASON_CLIENT = 3001;
    const wsLocalStore = useWsLocalStore()
    let lockReconnect=false
    function WsDestory() {
        if (WssInterval) {
            clearInterval(WssInterval);
        }
        if(WS){
            WS.close(__CLOSE_REASON_CLIENT, "客户端主动关闭");
        }
    }
    function WsResetPort(port:number){
        _PORT=port
    }
    function StartWatchWebSocket() {
        if (WssInterval) {
            clearInterval(WssInterval);
        }
        WssInterval = setInterval(() => {
            if (WS) {
                if (WS.readyState === WS.OPEN) {
                    // 发ping命令
                    WS.send("PING");
                } else {
                    // 尝试重连
                    wsLocalStore.updateWsMsg(EnWsAction.Reconnect, WS.readyState, "尝试重连")
                    setTimeout(() => {
                        WebSocketStart();
                    }, 200)
                }
            }
        }, __HeartbeatTime);
    }

    /**
     * 启动webSocket
     * @param port 端口号
     * @param duration 搜索时长 
     */
    function WebSocketStart() {
        if (WS && WS.readyState == WS.OPEN) {
            wsLocalStore.updateWsMsg(EnWsAction.Open, WS.readyState, "webSocket已连接")
            return
        }
        if(lockReconnect){//是否正在尝试连接，若是，不能尝试连接，保证WS只有一个
            return
        }
        lockReconnect=true
        let websocketUrl = `ws://localhost:${_PORT}/api/v1/820li/ws/listen`
        if (WS) {
            try {
                WS.close(__CLOSE_REASON_CLIENT, "启动重连时关闭");
            } catch (err) {
                let readyState = WS ? WS.readyState : -1
                wsLocalStore.updateWsMsg(EnWsAction.Close, readyState, err.message)
            }
        }
        WS = new WebSocket(websocketUrl);
        StartWatchWebSocket()
        WS.onopen = () => {
            wsOnOpen();
        };
        WS.onmessage = event => {
            wsOnMessage(event);
        };
        WS.onclose = event => {
            wsOnClose(event);
        };
        WS.onerror = event => {
            wsOnError(event);
        };
    }
    /**
     * 发送消息，只有在连接成功时才可以
     * @param action 行为
     * @param params 参数
     * @returns 
     */
    function WsSend(action, params) {
        if (WS === undefined || WS == null) {
            wsLocalStore.updateWsMsg(EnWsAction.Send, -1, "请确保webSocket已连接")
            return;
        }
        let wsState = WS.readyState;
        let errMsg = ""
        if (wsState === WS.CONNECTING) {
            errMsg = "webSocket正在连接..."
        } else if (wsState === WS.CLOSING) {
            errMsg = "连接正在关闭..."
        } else if (wsState === WS.CLOSED) {
            errMsg = "连接已经关闭或者打开连接失败"
        }
        if (utils.isNotEmpty(errMsg)) {
            wsLocalStore.updateWsMsg(EnWsAction.Send, wsState, errMsg)
            return
        }
        const sendInfo = {
            action: action,
            params: params
        }
        WS.send(JSON.stringify(sendInfo));
    }
    function WsClose() {
        if (WS) {
            WS.close(__CLOSE_REASON_CLIENT, "客户端主动关闭");
        } else {
            let readyState = WS ? WS.readyState : -1
            wsLocalStore.updateWsMsg(EnWsAction.Close, readyState, "请确保webSocket已连接")
        }
    }
    function wsOnOpen() {
        lockReconnect=false
        let readyState = WS ? WS.readyState : -1
        wsLocalStore.updateWsMsg(EnWsAction.Open, readyState, "已连接socket!")
    }
    function wsOnMessage(event) {
        lockReconnect=false
        try {
            let eventData = JSON.parse(event.data);
            wsLocalStore.updateWsMsg(EnWsAction.ReceiveMsg, WS.readyState, eventData)
        } catch (err) {//若不是JSON，丢弃掉，不需要传递出去
            wsLog.debug(event.data)
            wsLog.error("wsOnMessage", err)
        }
    }
    function wsOnClose(event) {
        lockReconnect=false
        let readyState = WS ? WS.readyState : -1
        wsLocalStore.updateWsMsg(EnWsAction.Close, readyState, event.message)
    }
    function wsOnError(event) {
        lockReconnect=false
        let readyState = WS ? WS.readyState : -1
        wsLocalStore.updateWsMsg(EnWsAction.Error, readyState, event.message)
    }
    function WsStateStr() {
        if (WS == null) {
            return "webSocket尚未初始化"
        }
        let stateStr = ""
        switch (WS.readyState) {
            case WS.CLOSED: stateStr = "已关闭(CLOSED)"; break;
            case WS.CLOSING: stateStr = "正在关闭(CLOSING)"; break;
            case WS.CONNECTING: stateStr = "连接中(CONNECTING)"; break;
            case WS.OPEN: stateStr = "已打开(OEPN)"; break;
            default: stateStr = `未知状态(${WS.readyState})`
        }
        return stateStr
    }
    function WsIsOpen() {
        return WS.readyState == WS.OPEN
    }
    function WsPort() {
        return _PORT
    }
    return {
        WebSocketStart,
        WsClose,
        WsSend,
        WsStateStr,
        WsIsOpen,
        WsPort,
        WsDestory,
        WsResetPort
    }
}