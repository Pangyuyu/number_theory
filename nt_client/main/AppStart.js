const { BrowserWindow } = require('electron')
const path = require('path');
const { Log } = require("./utils/log")
const log = new Log().withTag("AppStart.js")
const utils = require("./utils/utils")
/**
 * APP启动时的方法封装
 */
module.exports.AppStart = function () {
    this.winRestoreFocus = function (win) {
        if (win) {
            if (win.isMinimized()) {
                win.restore()
            }
            win.focus()
        }
    }
    /**
     * 开发模式下安装Chrome调试工具
     */
    this.installDevtools = async function () {
        //调试工具已过时，暂时不用，待以后编译新的
        // if (process.env.NODE_ENV == "development") {
        //     try {
        //         // 新增的：安装vue-devtools
        //         const {session} = require("electron");
        //         const path = require("path");
        //         const extPath = path.resolve(__dirname, "../shell-chrome")
        //         log.d("vue-devtools地址", extPath)
        //         session.defaultSession.loadExtension(extPath);
        //     } catch (e) {
        //         log.e("Vue Devtools failed to install:", e.toString())
        //     }
        // }
    }
    /**
     * 初始化窗体
     */
    this.initWindow = function () {
        const preLoadPath = path.join(__dirname, 'preload.js')
        // log.d("预加载文件地址", preLoadPath)
        return new BrowserWindow({
            width: 1280,
            height: 720,
            minWidth: 1280,
            minHeight: 720,
            maximize: true,
            maximizable: true,
            center: true,
            backgroundColor: '#fff',
            webPreferences: {
                nodeIntegration: false,
                webSecurity: false,//
                allowRunningInsecureContent: false,
                contextIsolation: true,//启用上下文隔离
                sandbox: false,//启用沙盒
                preload: preLoadPath, //预加载脚本，注入ipc所需对象
                enableRemoteModule: false,
                spellcheck:false,//屏蔽拼写检查器
            },
            fullscreen: false,//窗口为全屏
            fullscreenable: false,//窗口是否可以进入全屏状态
            skipTaskbar: false,//是否在任务栏中显示窗口。 默认值为 false
            show: false,
        })
    }
    /**
     * 初始化窗体加载
     * @param {BrowserWindow} win 窗体
     */
    this.initWinLoad = async function (win) {
        const isDev = process.env.NODE_ENV == "development" ? true : false;
        if (isDev) {
            this.installDevtools()
            await win.loadURL(utils.LocalUrl)
            if (!process.env.IS_TEST) win.webContents.openDevTools()
        } else {
            const filePath = `file://${path.join(__dirname, '../dist/index.html')}`
            win.loadURL(filePath)
        }
        win.show()
        win.center()
        win.setTitle(utils.getTitle())
        if (isDev) {
            win.webContents.openDevTools();
        }
        win.on("closed", function () {
            
            win = null
        })
    }
}
