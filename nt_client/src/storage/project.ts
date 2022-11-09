import { Project } from "@/common/model/Project"
const _KEY_PROJECT_SELECT="key_project_select"
export default class StgProject{
    static getProj():Project{
        let value=localStorage.getItem(_KEY_PROJECT_SELECT)
        let pro:Project=new Project()
        if(value){
            const vjs=JSON.parse(value)
            pro.id=vjs.id
            pro.name=vjs.name
        }
        return pro
    }
    static saveProj(pro:Project):void{
        localStorage.setItem(_KEY_PROJECT_SELECT,JSON.stringify(pro))
    }

}