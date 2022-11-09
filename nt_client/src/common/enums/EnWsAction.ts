/**
 * webSocket消息的行为枚举
 */
export enum EnWsAction {
    None = "none",
    Start = "Start",
    Open = "Open",
    Connect = "Connect",
    Reconnect = "Reconnect",
    Close = "Close",
    Send = "Send",
    Ping = "Ping",
    Error = "Error",
    ReceiveMsg="receiveMsg"
}