const { app, clipboard } = require('electron');
const { Log } = require("../utils/log")
const appPackage = require("../../package.json") //当前package包内容
const utils = require("../utils/utils");
const { NewOK } = require('../utils/error');
const log = new Log().withTag("tool-app")
const toolLocalServer = require("./tool-local-server")
class ToolApp {
    registerOn(ipcMain, mainWin) {
        ipcMain.on("app-exit", async (event, args) => {
            await toolLocalServer.stopChildProcess()
            app.quit()
        })
        ipcMain.on("app-title", (event, args) => {
            let title = utils.getTitle("")
            if (args && args.title) {
                title = utils.getTitle(args.title)
            }
            mainWin.setTitle(title)
        })
        ipcMain.on("app-copy", (event, args) => {
            clipboard.writeText(args.text)
        })
        ipcMain.handle("app-info", (event, args) => {
            return {
                appVersion: appPackage.version,
                platform: process.platform,
                arch: process.arch,
                chromeVersion: process.versions.chrome
            }
        })
        ipcMain.handle("app-isDebug", (event, args) => {
            const isDev = (process.env.NODE_ENV == "development") ? true : false;
            return NewOK({
                isDebug: isDev
            })
        })
    }
    unRegister(ipcMain) {
        ipcMain.removeHandler("app-info")
        ipcMain.removeHandler("app-isDebug")
    }
}
module.exports = new ToolApp()