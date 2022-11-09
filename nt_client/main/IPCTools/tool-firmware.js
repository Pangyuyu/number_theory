const { dialog } = require("electron")
const { Log } = require("../utils/log")
const path = require("path")
const os=require('os')
const { NewOK } = require("../utils/error")
const utils = require("../utils/utils")
const fsPromise = require('fs').promises //使用fs promises方法
const log = new Log().withTag("tool-firmware")
const openOptions = {
    title: "选择固件",
    defaultPath: "",
    buttonLabel: "确定选择",
    filters: [
        { name: "FD820Li固件文件", extensions: ["zip"] }
    ],
    properties: ["openFile"],
    message: "请选择FD820Li固件文件",
    securityScopedBookmarks: true
}
function calcFileSize(fileStatSize) {
    let statSize = fileStatSize
    let sizeStr = `${statSize} B`
    if (statSize > 1024) {
        statSize = statSize / 1024
        sizeStr = `${statSize.toFixed(2)} KB`
    }
    if (statSize > 1024) {
        statSize = statSize / 1024
        sizeStr = `${statSize.toFixed(2)} MB`
    }
    if (statSize > 1024) {
        statSize = statSize / 1024
        sizeStr = `${statSize.toFixed(2)} GB`
    }
    return {
        statSize,
        sizeStr
    }
}
/**
 * 获取固件临时目录及文件名称
 */
function getFirmwareTemp(md5) {
    const tempDirPath = path.join(os.tmpdir(), "guestin","820li_ota","firmware")
    const tempFileName = `${md5}.zip`
    const fullPath = path.join(tempDirPath, tempFileName)
    return {
        dir: tempDirPath,
        name: tempFileName,
        path: fullPath
    }
}
// 选择固件
class ToolFirmware {
    registerOn(ipcMain, mainWin) {
        //选择固件文件
        ipcMain.handle("fireware-zip-choose", async (event, args) => {
            const openRes = await dialog.showOpenDialog(mainWin, openOptions)
            if (openRes.canceled) {
                return {
                    code: -1,
                    message: '您已取消选择固件!'
                }
            }
            const check = openRes.filePaths && openRes.filePaths.length > 0
            if (!check) {
                return {
                    code: 1,
                    message: "未选择任何文件"
                }
            }
            const filePath = openRes.filePaths[0]
            const fileHandle = await fsPromise.open(filePath)
            const fileStat = await fileHandle.stat()
            await fileHandle.close()
            const calcRes = calcFileSize(fileStat.size)
            return {
                code: 0,
                data: {
                    path: filePath,
                    size: fileStat.size,
                    sizeStr: calcRes.sizeStr,
                    fileName:path.basename(filePath),
                    extName:path.extname(filePath)
                }
            }
        })
        ipcMain.handle("fireware-exists", async (event, args) => {
            const temp = getFirmwareTemp(args.md5)
            const exRes = await utils.fileExist(temp.path)
            log.d("临时文件信息", exRes)
            if (exRes.isFail) {
                return NewOK({
                    existed: false,
                    md5Checked: false,
                    ...temp
                })
            }
            const checkRes = await utils.checkMd5(temp.path, args.md5)
            if (checkRes.isFail) {
                return NewOK({
                    existed: true,
                    md5Checked: false,
                    ...temp
                })
            }
            return NewOK({
                existed: true,
                md5Checked: true,
                ...temp
            })
        })
    }
    unRegister (ipcMain) {
        ipcMain.removeHandler('fireware-choose')
        ipcMain.removeHandler('fireware-zip-choose')
    }
}

module.exports=new ToolFirmware()