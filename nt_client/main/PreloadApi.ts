/**
 * 主进程更改计数回调
 */
 interface IMainProcessCallBack {
   /**
    * 回调方法
    * @param _event 事件
    * @param value 值
    */
   (_event: any, value: any): void
}
/**
 * preLoad.js中使用方法的TS定义
 */
export default interface PreLoadApi {
   /**
    * 响应主进程菜单事件
    */
   onMenuAction(callback:IMainProcessCallBack):void,
   /**
    * 退出APP
    */
   appExit():void,
   /**
    * 设置App标题
    */
   appTitle(title:string):void,
   /**
    * 复制
    */
   appCopy(text:string):void,
   /**
    * 获取软件的基本信息
    */
   appInfo():Promise<any>,
   /**
    * 当前是否是release版本
    */
   appIsDebug():Promise<any>,
   /**
    * 选择固件文件
    */
   firmwareChoose():Promise<any>,
   /**
    * 本地服务：开启
    */
   localServerStart():Promise<any>,
   /**
    * 本地服务：停止
    */
   localServerStop():Promise<any>,
   /**
    * 本地服务：检测状态
    */
   localServerState():Promise<any>,
   /**
    * 本地服务：获取启动端口号
    */
   localServerPort():Promise<any>,
   /**
    * 下载文件，此方法会弹窗选择目录
    * 
    * @param url 文件地址 
    * @param name 要保存的文件名称
    * @param md5 文件的MD5值
    * @param tag 此次下载的附带信息
    */
   fileDown(url:string,name:string,md5:string,tag:string):Promise<any>,
   /**
    * 下载文件，此方法将直接指定文件目录，实现静默下载，
    * @param url 文件地址 
    * @param filePath 文件完整路径，需要包含目录及文件名称
    * @param md5 文件的MD5值
    * @param tag 此次下载的附带信息
    */
   fileDownSilence(url:string,filePath:string,md5:string,tag:string),
   /**
    * 当文件正在下载时的回复
    */
   onFileDownReply(callback:IMainProcessCallBack):void,
   /**
    * 打开指定目录
    * @param dirPath 目录路径
    */
   directoryOpen(dirPath:string):Promise<any>,
   /**
    * 对文件进行MD5校验
    * @param filePath 文件路径
    * @param targetMd5 用于校验的MD5值
    */
   fileMd5Checked(filePath:string,targetMd5:string):Promise<any>,
   /**
    * 检测固件是否已存在
    */
   firmwareExist(repo:string,version:string,md5:string):Promise<any>,
   /**
    * 安全存储加密字符串
    * @param plainText 原始字符串
    */
   appSafeEncrypt(plainText:string):Promise<any>,
   /**
    * 安全存储解密字符串
    * @param encrypted 已加密的数据
    */
   appSafeDecrypt(encrypted:string):Promise<any>,
   /**
    * 查询质数
    * @param start 素数开始索引 
    * @param end 素数结束索引
    */
   dbQueryTheoryByIndex(start:number,end:number):Promise<any>,
}