// electron/electron.js
const { Log } = require("./utils/log")
const log = new Log().withTag("main.js")
const { app, nativeImage } = require('electron');
const { AppStart } = require("./AppStart")
const { AppMenu } = require("./AppMenu")
const ipcTools = require("./IPCTools/IpcEntrance")
// const toolLocalServer=require("./IPCTools/tool-local-server")
const isDev = process.env.IS_DEV == "true" ? true : false;
const shouldQuit = app.requestSingleInstanceLock() //单实例
const appStart = new AppStart()
const appMenu = new AppMenu()
let mainWin = null //窗口
/*在开发模式下，应父进程（parent process）的要求完全退出。 */

if (isDev) {
  if (process.platform === "win32") {
    process.throwDeprecation = true  //用于控制是否将弃用警告作为异常抛出。将此设置为true会引发弃用错误。使用此属性代替
    process.traceDeprecation = true //用于控制是否打印弃警告的堆栈跟踪到stderr。将此设置为true将打印废弃警告的堆栈跟踪
    process.traceProcessWarnings = true //用于控制是否打印进程警告及其堆栈跟踪到stderr。将此设置为true将会为进程警告（包括弃用）打印堆栈跟踪
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit()
      }
    })
  } else {
    process.on("SIGTERM", () => {
      app.quit()
    })
  }
}

/*判断是否已经有一个实例（窗体），若有则直接把刚启动的退出。*/
if (!shouldQuit) {
  app.quit()
} else {
  /*事件：second-instance 监听第二个实例是否已启动*/
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    log.d("====second-instance===")
    appStart.winRestoreFocus(mainWin)
  })
  //只有ready之后才可以初始化窗体
  app.commandLine.appendSwitch('enable-experimental-web-platform-features')
  app.whenReady().then(() => {
    createWindow()   
    /*activate: macOS 当应用被激活时发出。*/
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
}

app.on('will-finish-launching', () => {
  log.d("====will-finish-launching===")
})
app.on("window-all-closed", async () => {
  log.d("====window-all-closed===")
  // await toolLocalServer.stopChildProcess()
  app.quit()
})

app.on("exit",async () =>{
  log.d("====app exit===")
  // await toolLocalServer.stopChildProcess()
})

function createWindow() {
  //如果窗体没有被销毁
  if (mainWin&&!mainWin.isDestroyed()) {
    mainWin.showInactive()
  } else {
    app.setAppUserModelId("xing_number_theory")
    // toolLocalServer.Init()
    mainWin = appStart.initWindow()
    appStart.initWinLoad(mainWin)
    appMenu.initMenu(mainWin)
    ipcTools.register(mainWin)
    mainWin.setIcon(nativeImage.createFromPath("./resources/icons/logo.png"))
  }
}