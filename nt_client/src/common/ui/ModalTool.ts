import * as event from "./Event";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import Logger from "@/common/logger/logger";
import utils from "../utils/utils";
const log = new Logger("Modal");
let __intervalID_Loading: any = -1;
/**
 * 模态框、吐丝等
 */
export default class ModalTool {
  private static log: Logger = new Logger("Modal");
  private static loading: any;
  /**
   * 显示吐丝
   * @param msg 消息内容
   * @param type 类型
   * @param duration 时长
   */
  static ShowToast(
    msg: string,
    type?: "success" | "warning" | "info" | "error" | undefined,
    duration?: number
  ) {
    ElMessage({
      message: msg,
      type: type ? type : "info",
      duration: duration ? Number.parseInt(duration+"") : 2000,
    });
  }
  /**
   * 显示等待框
   * @param msg 需要显示的提醒信息
   * @param timeout 超时关闭时间，单位秒，若小于等于0，则不自动关闭
   */
  static ShowLoading(msg: string, timeout: number = 10) {
    ModalTool.HideLoading();
    const text=utils.isNotEmpty(msg)?msg:"请稍等...";
    ModalTool.loading = ElLoading.service({
      lock: true,
      text: text,
      background: "rgba(0, 0, 0, 0.7)",
    });
    if (timeout > 0) {
      __intervalID_Loading = setTimeout(() => {
        ModalTool.loading.close();
      }, timeout * 1000);
    }
  }
  /**
   * 隐藏等待框
   */
  static HideLoading() {
    if (__intervalID_Loading > 0) {
      clearTimeout(__intervalID_Loading);
      __intervalID_Loading = -1;
    }
    if (ModalTool.loading) {
      ModalTool.loading.close();
    }
  }
  /**
   * 显示只有“确定”按钮的模态框
   * @param title 标题
   * @param msg 内容
   * @param onOk 单击OK时的事件
   * @param type 弹窗类型
   */
  static ShowDialog(title: string, msg: string,onOk?: event.dialogCallback,type?:'success'|'info'|'warning'|'error'|undefined) {
    ElMessageBox.alert(msg, title, {
      confirmButtonText: "确定",
      type:type?type:'info',
      callback: (action: any) => {
        if (onOk) {
          onOk();
        }
      },
    });
  }
  static ShowDialogSuccess(title: string, msg: string,onOk?: event.dialogCallback){
    ModalTool.ShowDialog(title,msg,onOk,'success')
  }
  static ShowDialogInfo(title: string, msg: string,onOk?: event.dialogCallback){
    ModalTool.ShowDialog(title,msg,onOk,'info')
  }
  static ShowDialogWarn(title: string, msg: string,onOk?: event.dialogCallback){
    ModalTool.ShowDialog(title,msg,onOk,'warning')
  }
  static ShowDialogError(title: string, msg: string,onOk?: event.dialogCallback){
    ModalTool.ShowDialog(title,msg,onOk,'error')
  }
  /**
   * 显示询问模态框
   */
  static ShowAsk(
    title: string,
    msg: string,
    onOk?: event.dialogCallback,
    onCacnel?: event.dialogCallback
  ) {
    ElMessageBox.confirm(msg, title, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info",
    })
      .then(() => {
        if (onOk) {
          onOk();
        }
      })
      .catch(() => {
        if (onCacnel) {
          onCacnel();
        }
      });
  }
}
