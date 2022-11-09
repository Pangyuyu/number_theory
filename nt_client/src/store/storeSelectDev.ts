import { defineStore } from "pinia"
/**
 * 选中的设备，这个主要用于页面传递
 */
export const useSelectDevice=defineStore("selectDevice",{
    state:()=>{
        return {
            params:{},
        }
    },
    getters:{
        
    },
    actions:{
        setParam(params){
            this.params=params
        },
        getParams(){
            return this.params
        }
    }
})