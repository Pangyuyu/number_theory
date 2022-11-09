import { defineStore } from "pinia"
export const useLoginStore=defineStore("login",{
    state:()=>{
        return {
            isLogin:false,/*是否已登录*/
        }
    },
    getters: {

    },
    actions: {
        login(loginData: any) {
            this.isLogin = true
        },
        loginOut() {
            this.isLogin = false
        },
        loginKeep() {
            this.isLogin = true
        }
    }
})