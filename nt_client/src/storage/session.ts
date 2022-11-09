import Errors from "@/common/errors/Errors";
import AppSession from "@/common/model/AppSession";
const __KEY_APP_SESSION = "key_app_session"

export default class StgSession {
    static getSession(): Promise<Errors> {
        return new Promise(async (resolve, __) => {
            let value = localStorage.getItem(__KEY_APP_SESSION)
            let appSesson: AppSession;
            if (value) {
                const decryptRes = await window.EPre.appSafeDecrypt(value)
                const jsonObj = JSON.parse(decryptRes.data)
                appSesson = {
                    ...jsonObj
                }
            }
            resolve(Errors.newOk(appSesson))
        })

    }
    static async saveSession(appSesson: AppSession) : Promise<Errors>{
        return new Promise(async(resolve, __)=>{
            const jsonStr = JSON.stringify(appSesson)
            const encryptRes = await window.EPre.appSafeEncrypt(jsonStr)
            localStorage.setItem(__KEY_APP_SESSION, encryptRes.data)
            resolve(Errors.newOk())
        })
    }
}
