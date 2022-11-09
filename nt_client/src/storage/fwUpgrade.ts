import FwUpgArgs from "@/common/model/FwUpgArgs"
import SysConst from "@/common/model/SysConst"
const _KEY_FW_UPGRADE="key_fireware_upgrade"
/**
 * 固件升级参数的本地缓存
 */
export default class StgFwUpgrade{
    static get():FwUpgArgs{
        let args=new FwUpgArgs()
        let value=localStorage.getItem(_KEY_FW_UPGRADE)
        console.log("固件升级参数",value)
        if(value){
            const vjs=JSON.parse(value)
            args.localGroupCount=vjs.onlineGroupCount?vjs.localGroupCount:SysConst.FW_UPGRADE_LOCAL_GROUP_COUNT
            args.onlineGroupCount=vjs.onlineGroupCount?vjs.onlineGroupCount:SysConst.FW_UPGRADE_ONLINE_GROUP_COUNT
            args.stateQueryInterval=vjs.stateQueryInterval?vjs.stateQueryInterval:SysConst.FW_UPGRADE_STATE_QUERY_INTERVAL
        }
        return args
    }
    static save(args:FwUpgArgs){
        localStorage.setItem(_KEY_FW_UPGRADE,JSON.stringify(args))
    }
}