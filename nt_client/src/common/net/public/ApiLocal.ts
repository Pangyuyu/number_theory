import apiBase from "./ApiBase";
import SysConst from "@/common/model/SysConst";
const LOCAL_BASEURL = "http://localhost";
// const LOCAL_BASEURL = "http://192.168.2.201";

let LOCAL_PORT = SysConst.DEBUG_PORT + ""
export default class ApiLocal {
    static getBaseUrl() {
        return `${LOCAL_BASEURL}:${LOCAL_PORT}`
    }
    static setLocalPort(port: string) {
        LOCAL_PORT = port
    }
    /**
     * 开启设备搜索
     * @param duration 搜索时长
     * @returns 
     */
    static deviceDiscoveryStart(duration: number) {
        return apiBase.POST("/api/v1/820li/device/discovery")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                duration: duration
            })
    }
    /**
     * 关闭设备搜索
     * @returns 
     */
    static deviceDiscoveryStop() {
        return apiBase.DELETE("/api/v1/820li/device/discovery")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({})
    }
    /**
     * 获取当前设备搜索状态
     */
    static deviceDiscoveryState() {
        return apiBase.GET("/api/v1/820li/device/discovery/state")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({})
    }
    static listUpgradeTasks() {
        return apiBase.GET("/api/v1/820li/firmware/upgrade/local/tasks")
            .withEndpoint(ApiLocal.getBaseUrl())
    }
    // static firmwareUpgradeTasksArgs(groupCount: number) {
    //     return apiBase.DELETE("/api/v1/820li/firmware/upgrade/tasks/args")
    //         .withEndpoint(ApiLocal.getBaseUrl())
    //         .withTimeout(2 * 1000)
    //         .withBody({
    //             groupCount: groupCount
    //         })
    // }
    /**
     * 固件升级:本地，直接上传固件的方式
     * @param filePath 固件路径
     * @param deviceIps IP地址
     * @returns 
     */
    static firmwareUpgradeTasks(filePath: string, deviceIps: Array<string>) {
        return apiBase.POST("/api/v1/820li/firmware/upgrade/local/tasks")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                filePath: filePath,
                deviceIps: deviceIps
            })
    }

    static firmwareUpgradeTasksAbort() {
        return apiBase.DELETE("/api/v1/820li/firmware/upgrade/local/tasks")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({

            })
    }

    static firmwareUpgradeTask(filePath: string, ip: string) {
        return apiBase.POST("/api/v1/820li/firmware/upgrade/local/task")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                filePath: filePath,
                ip: ip
            })
    }
    static firmwareUpgradeTaskArgs(groupCount: number) {
        return apiBase.POST("/api/v1/820li/firmware/upgrade/local/tasks/args")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                groupCount: groupCount
            })
    }
    static firmwareUpgradeTaskAbort(ip: string) {
        return apiBase.DELETE("/api/v1/820li/firmware/upgrade/local/task")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                ip: ip
            })
    }

    /**
     * 固件升级：远程，使用远程URL
     * @param remoteUrl 固件的远程URL地址
     * @param deviceSns 固件的SN
     */
    static firmwareUpgradeRemote(remoteUrl: string, queryInterval: number, deviceSns: Array<string>) {
        return apiBase.POST("/api/v1/820li/firmware/upgrade/remote")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                remoteUrl: remoteUrl,
                deviceSns: deviceSns,
                timeoutSeconds: 600,
                queryInterval: queryInterval
            })
    }
    static firmwareUpgradeTasksAbortRemote(deviceSns: Array<string>) {
        return apiBase.DELETE("/api/v1/820li/firmware/upgrade/remote")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                deviceSns: deviceSns
            })
    }
    /**
     * 获取硬件配置信息
     */
    static readHardwareCfg() {
        return apiBase.GET("/api/v1/820li/hardware/config")
            .withEndpoint(ApiLocal.getBaseUrl())
    }
    /**
     * 获取硬件参数密文
     */
    static cfgGetEncrypt(tpId: number, lcdId: number, blBrightness: number, validTime: number) {
        return apiBase.POST("/api/v1/820li/hardware/config/encrypt")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                tpId: tpId,
                lcdId: lcdId,
                blBrightness: blBrightness,
                validTime: validTime
            })
    }
    /**
     * 硬件参数密文解密
     */
    static cfgDecrypt(text: string) {
        return apiBase.POST("/api/v1/820li/hardware/config/decrypt")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                text: text
            })
    }
    static firmwareDownEnc(repo: string, version: string, md5: string, validTime: number) {
        return apiBase.POST("/api/v1/820li/firmware/down/encrypt")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                repo: repo,
                version: version,
                md5: md5,
                validTime: validTime
            })
    }
    static firmwareDownDec(text: string) {
        return apiBase.POST("/api/v1/820li/firmware/down/decrypt")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                text: text
            })
    }
    static DemoTasksStart(taskNums: Array<number>) {
        return apiBase.POST("/api/v1/820li/demo/tasks")
            .withEndpoint(ApiLocal.getBaseUrl())
            .withBody({
                taskNums: taskNums
            })
    }
    static DemoTasksAbort(){
        return apiBase.DELETE("/api/v1/820li/demo/tasks")
            .withEndpoint(ApiLocal.getBaseUrl())
    }
}