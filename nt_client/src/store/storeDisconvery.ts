import { defineStore } from "pinia"
import DiscoveryDevice from "@/common/model/DiscoveryDevice"
/**
 * 本地升级 搜索到的设备缓存
 * 因为页面可能会覆盖，所以对象不能在页面中声明
 */
export const useDeviceDisconvery = defineStore("deviceLocal", {
    state: () => {
        return {
            /**
             * 设备列表
             */
            devList: Array<DiscoveryDevice>()
        }
    },
    getters: {
        
    },
    actions: {
        append(dev: DiscoveryDevice):DiscoveryDevice {
            const theDevice = this.devList.find((item: DiscoveryDevice) => {
                return item.sn == dev.sn
            })
            if (theDevice) {
                theDevice.ip = dev.ip
                theDevice.buildTime=dev.buildTime
                theDevice.version=dev.version
                theDevice.code=dev.code
                return null
            } else {
                const len= this.devList.push(dev)
                return this.devList[len-1]
            }
        },
        clear():void{
            this.devList=new Array<DiscoveryDevice>()
        },
        getAllList():Array<DiscoveryDevice>{
            return this.devList
        }
    }
})