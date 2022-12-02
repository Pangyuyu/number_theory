const ipcMain = require("electron").ipcMain //IPC通信主进程实例
const toolLocalServer = require("./tool-local-server")
const toolFireware = require("./tool-firmware")
const toolApp = require("./tool-app")
const toolFileDown = require("./tool-file-down")
const toolSafe = require("./tool-safe")
const toolPrime = require("./tool-Prime")
const toolCollatz = require("./tool-collatz")
class IpcEntrance {
    removeAll() {
        //清理可能存在的事件，因为托盘可能会二次打开窗体
        ipcMain.removeAllListeners()
        toolLocalServer.unRegister(ipcMain)
        toolFireware.unRegister(ipcMain)
        toolApp.unRegister(ipcMain)
        toolFileDown.unRegister(ipcMain)
        toolSafe.unRegister(ipcMain)
        toolPrime.unRegister(ipcMain)
        toolCollatz.unRegister(ipcMain)
        
    }
    register(mainWin) {
        this.removeAll()
        toolLocalServer.registerOn(ipcMain, mainWin)
        toolFireware.registerOn(ipcMain, mainWin)
        toolApp.registerOn(ipcMain, mainWin)
        toolFileDown.registerOn(ipcMain, mainWin)
        toolSafe.registerOn(ipcMain, mainWin)
        toolPrime.registerOn(ipcMain, mainWin)
        toolCollatz.registerOn(ipcMain, mainWin)
    }
}
module.exports = new IpcEntrance()