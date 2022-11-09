const {
    Menu, dialog, Notification, nativeImage
} = require('electron')
const appPackage = require("../package.json") //当前package包内容
const { Log } = require("./utils/log")
const log = new Log().withTag("AppMenu.js")
module.exports.AppMenu = function () {
    this.win = null;
    this.initMenu = function (win) {
        this.win = win;
        const template = [
            ...this.getMenus(),
        ]
        const menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
    }
    this.getMenus = function () {
        // const isDev = process.env.NODE_ENV == "development" ? true : false;
        let subCaoZuo = {
            label: "操作",
            submenu: [{
                label: "刷新",
                role: "reload"
            },
            {
                label: "强制刷新",
                role: "forceReload"
            },
            { type: "separator" },
            {
                label: "最小化",
                role: "minimize"
            },
            {
                label: "开发者工具",
                role: "toggleDevTools",
                accelerator: "CommandOrControl+Shift+Alt+Up",
                visible: true,
                acceleratorWorksWhenHidden: true,
            }
            ],
        }
        // if (isDev) {
        //     subCaoZuo.submenu.push({
        //         label: "开发者工具",
        //         role: "toggleDevTools",
        //         accelerator: "CommandOrControl+Shift+Alt+Up",
        //         visible: true,
        //         acceleratorWorksWhenHidden: true,
        //     })
        // }
        return [
            subCaoZuo,
            {
                label: '编辑',
                submenu: [
                    {
                        label: '剪切',
                        accelerator: 'CmdOrCtrl+X',
                        selector: 'cut:',
                        role: 'cut'
                    },
                    {
                        label: '复制',
                        accelerator: 'CmdOrCtrl+C',
                        selector: 'copy:',
                        role: 'copy'
                    },
                    {
                        label: '粘贴',
                        accelerator: 'CmdOrCtrl+V',
                        selector: 'paste:',
                        role: 'paste'
                    },
                    {
                        label: '全选',
                        accelerator: 'CmdOrCtrl+A',
                        selector: 'selectAll:',
                        role: 'selectall'
                    }
                ]
            },
            {
                label: "帮助",
                submenu: [
                    {
                        label: "检查更新",
                        click: (event, focusedWindow, focusedWebContents) => {
                            this.sendCheckVersion()
                        },
                    },
                    { type: "separator" },
                    {
                        label: "关于",
                        click: (event, focusedWindow, focusedWebContents) => {
                            this.showAbout()
                        },
                    },
                ],
            }
        ]
    }
    this.showAbout = function () {
        let appVersion = appPackage.version
        let detailMsg = `OTA升级工具:${appVersion}`;
        const infoList = ["chrome", "node", "electron", "v8", "openssl"]
        infoList.forEach(item => {
            detailMsg += `\n${item}:${process.versions[item]}`
        })
        dialog.showMessageBox(this.win, {
            title: "关于",
            type: "info",
            message: "客町科技",
            detail: detailMsg,
        })
    }
    this.sendCheckVersion = function () {
        if (this.win != null) {
            this.win.webContents.send('menu-action', {
                action: "checkVersion",
                appVersion: appPackage.version,
                platform: process.platform,
                arch: process.arch,
                chromeVersion: process.versions.chrome
            })
        }
    }
    this.sendKtOtaCtrl = function (action) {
        this.win.webContents.send('menu-action', {
            action: action
        })
    }
}