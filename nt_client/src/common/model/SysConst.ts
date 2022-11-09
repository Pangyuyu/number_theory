
export default class SysConst {
    static readonly APP_TITLE: string = "孤星数论-测试";
    static readonly APP_LOGO: string = '/static/logo/logo.png';
    static readonly APP_LOGO_SHARE = '/static/logo/logo-share.png';
    static readonly IMG_PREFIX="data:image/jpeg;base64,";
    static readonly CIPHERTEXT_VALID=5 //代码参数默认有效期限
    static DEBUG=false //是否是Debug模式，此模式本地服务固定启动为30001
    static readonly DEBUG_PORT=30001 //debug模式下本地服务启动的端口好
    static readonly FW_UPGRADE_LOCAL_GROUP_COUNT=10 //固件升级时本地分组数量
    static readonly FW_UPGRADE_ONLINE_GROUP_COUNT=5 //固件升级时在线分组数量
    static readonly FW_UPGRADE_STATE_QUERY_INTERVAL=3 //升级时状态轮询间隔
    static readonly FW_NAME_PREFIX="ktupdate_" //固件名称前缀
}