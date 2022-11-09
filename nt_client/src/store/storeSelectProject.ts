import { defineStore } from "pinia"
import { Project } from "@/common/model/Project"
export const useSelectProject=defineStore("selectProject",{
    state:()=>{
        return {
            project:Project
        }
    },
    getters:{
        
    },
    actions:{
        change(pro:Project){
            this.project=pro
        },
        getProject(){
            return this.project
        }
    }
})