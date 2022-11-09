import { defineStore } from "pinia"
export const useWindowStore=defineStore("menu",{
    state:()=>{
        return {
            sizeChangeTag:0,
            w:0,
            h:0
        }
    },
    actions:{
        changeSize(w:number,h:number){
            this.w=w
            this.h=h
            this.sizeChangeTag=new Date().getTime()
        }
    }
})