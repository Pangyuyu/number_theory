import Errors from "@/common/errors/Errors";
import LoginInfo from "@/common/model/LoginInfo";
const __KEY_LOGIN = "key_login"

/**
 * 登录缓存
 */
export default class StgLogin {
    /**
     * 获取最近一次登录信息
     */
    static async getLastLogin(): Promise<Errors> {
        return new Promise(async (resolve, __) => {
            let value = localStorage.getItem(__KEY_LOGIN)
            let loginInfo = new LoginInfo()
            if (value) {
                const decryptRes = await window.EPre.appSafeDecrypt(value)
                const jsonObj = JSON.parse(decryptRes.data)
                loginInfo = {
                    ...jsonObj
                }
            }
            resolve(Errors.newOk(loginInfo))
        })
    }
    static updateLogin(login: LoginInfo) {
        return new Promise(async (resolve, __) => {
            const jsonStr = JSON.stringify(login)
            const encryptRes = await window.EPre.appSafeEncrypt(jsonStr)
            localStorage.setItem(__KEY_LOGIN, encryptRes.data)
            resolve(Errors.newOk())
        })
    }
}