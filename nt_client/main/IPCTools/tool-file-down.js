const { Log } = require("../utils/log")
const log = new Log().withTag("tool-file-down")
const { NewOK, NewError } = require("../utils/error")
const { dialog } = require('electron')
const utils = require("../utils/utils")
const path = require("path")
// const {ChildProcess} =require("child_process")
const event_filedown_reply = "file-down-reply"
let downWatchIsReg = false //下载监听是否已注册
//下载文件的基本信息
let downFile = {
    tag: "",//附带信息
    url: "",
    name: "",
    md5: "",
    saveFilePath: "",
    saveDirPath: ""
}

/*下载文件（此处只允许下载单个文件）*/
class ToolFileDown {
    registerOn(ipcMain, mainWin) {
        ipcMain.handle("file-down", async (event, args) => {
            //选择要保存的文件目录
            const openRes = await dialog.showSaveDialog(mainWin, {
                title: '保存文件',
                defaultPath: args.name,
                buttonLabel: '确定',
                properties: ['openDirectory', 'createDirectory', 'dontAddToRecent'],
                message: '请设置您要保存的文件名称'
            })
            if (openRes.canceled) {
                return NewError("您已取消下载文件")
            }
            const saveFilePath = openRes.filePath
            log.d("下载文件的本地路径", saveFilePath)
            const lastIndex = saveFilePath.lastIndexOf(path.sep)
            const saveDirPath = saveFilePath.substring(0, lastIndex)
            downFile = {
                url: args.url,
                name: args.name,
                md5: args.md5,
                saveFilePath: saveFilePath,
                saveDirPath: saveDirPath,
                tag: args.tag
            }
            if (!downWatchIsReg) {
                downWatchIsReg = true
                //这个如何取消？
                mainWin.webContents.session.on("will-download", this.downWatch)
            }
            mainWin.webContents.downloadURL(args.url)
            return NewOK({
                saveFilePath: saveFilePath,
                saveDirPath: saveDirPath
            })
        })
        ipcMain.handle("file-down-silence", async (event, args) => {
            log.d("静默下载参数", args)
            const saveFilePath = args.path
            const lastIndex = saveFilePath.lastIndexOf(path.sep)
            const saveDirPath = saveFilePath.substring(0, lastIndex)
            const fileName = saveFilePath.substring(lastIndex + 1)
            downFile = {
                url: args.url,
                name: fileName,
                md5: args.md5,
                saveFilePath: saveFilePath,
                saveDirPath: saveDirPath,
                tag: args.tag
            }
            if (!downWatchIsReg) {
                downWatchIsReg = true
                //这个如何取消？
                mainWin.webContents.session.on("will-download", this.downWatch)
            }
            log.d("下载信息", downFile)
            mainWin.webContents.downloadURL(args.url)
            return NewOK({
                saveFilePath: saveFilePath,
                saveDirPath: saveDirPath
            })
        })
        ipcMain.handle("directory-open", async (event, args) => {
            log.d(args)
            const dirPath = args.dirPath
            if (utils.isEmpty(dirPath)) {
                return NewError("目录不能为空!")
            }
            const exRes = await utils.fileExist(dirPath)
            if (exRes.isFail) {
                return exRes
            }
            require('child_process').exec(`start "" "${dirPath}"`);
            return NewOK()
        })
        ipcMain.handle("file-md5-check", async (event, args) => {
            if (utils.isEmpty(dirPath)) {
                return NewError("文件不能为空!")
            }
            if (utils.isEmpty(args.md5)) {
                return NewError("用于对比的MD5不能为空!")
            }
            const exRes = await utils.fileExist(dirPath)
            if (exRes.isFail) {
                return exRes
            }
            const checkRes = await utils.checkMd5(dirPath, args.md5)
            return checkRes
        })
    }
    downWatch(event, item, webContents) {
        const totalBytes = item.getTotalBytes()
        console.log('总大小：' + totalBytes)
        const totalSizeMb = (totalBytes / 1024.00 / 1024.00).toFixed(2)
        item.setSavePath(downFile.saveFilePath);
        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                //下载已中断,当前不支持中断
                console.log('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    var downSizeMb = (item.getReceivedBytes() / 1024.00 / 1024.00).toFixed(2)
                    var params = {
                        totalSizeMb: totalSizeMb,
                        downSizeMb: downSizeMb,
                        isEnd: false,
                        errMsg: '',
                        tag: downFile.tag,
                    }
                    webContents.send(event_filedown_reply, NewOK(params))
                }
            }
        })
        item.once('done', async (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully')
                const savePath = item.getSavePath()
                //计算文件MD5
                const params = {
                    totalSizeMb: totalSizeMb,
                    downSizeMb: '下载完成',
                    isEnd: true,
                    errMsg: '',
                    savePath: savePath,
                    tag: downFile.tag,
                }
                let md5Check = ""
                if (utils.isNotEmpty(downFile.md5)) {
                    const checkRes = await utils.checkMd5(savePath, downFile.md5)
                    md5Check = checkRes.isOk
                    params.md5Check = md5Check
                }
                webContents.send(event_filedown_reply, NewOK(params))
            } else {
                console.log(`Download failed: ${state}`)
                const errMsg = `下载文件失败，${state}`
                webContents.send(event_filedown_reply, NewError(errMsg, {
                    tag: downFile.tag,
                }))
            }
        })
    }
    unRegister(ipcMain) {
        ipcMain.removeHandler('file-down')
        ipcMain.removeHandler('file-md5-check')
        ipcMain.removeHandler('file-down-silence')
        ipcMain.removeHandler("directory-open")
    }
}

module.exports = new ToolFileDown()