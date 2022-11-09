const { safeStorage } = require("electron")
const { NewOK, NewError } = require("../utils/error")
const { Log } = require("../utils/log")
const log = new Log().withTag("tool-safe")
class ToolSafe {
    registerOn(ipcMain, mainWin) {
        ipcMain.handle("app-safe-encrypt", (event, args) => {
            const plainText = args.plainText
            if (!safeStorage.isEncryptionAvailable) {
                return plainText
            }
            // log.d("原始数据:", plainText)
            const encryptBuffer = safeStorage.encryptString(plainText)
            const data = encryptBuffer.toString("base64")
            // log.d("加密结果:", data)
            return NewOK(data)
        })
        ipcMain.handle("app-safe-decrypt", (event, args) => {
            const encrypted = args.encrypted
            if (!safeStorage.isEncryptionAvailable) {
                return args.encrypted
            }
            // log.d("密文:", encrypted)
            try {
                const decryptStr = safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
                // log.d("解密:", decryptStr)
                return NewOK(decryptStr)
            } catch (ex) {
                log.e("解密失败")
                log.e(ex)
                return NewError(ex.message,"")
            }
        })
    }
    unRegister(ipcMain) {
        ipcMain.removeHandler("app-safe-encrypt")
        ipcMain.removeHandler("app-safe-decrypt")
    }
}

module.exports=new ToolSafe()