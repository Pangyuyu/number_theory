import { EnWsAction } from "../enums/EnWsAction";
/**
 * webSocket 信息，用于界面传值
 */
export default class WsMessage{
    /**
     * 构造函数
     * @param a 行为 
     * @param s 状态
     * @param m 消息
     */
    constructor(a:EnWsAction,s:number,d:any){
        this.action=a;
        this.state=s;
        this.data=d
        this.receiveTime=new Date().getTime()
    }
    /**
     * 行为
     */
    action:EnWsAction;
    /**
     * 状态
     */
    state:number;
    /**
     * 消息内容
     */
     data:any;
    /**
     * 接收时间
     */
    readonly receiveTime:number;

}