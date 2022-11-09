/*文件管理操作*/
const { Log } = require("../utils/log")
const { dialog } = require('electron')
const fsPromise = require('fs').promises //使用fs promises方法
const log = new Log().withTag("tool-file-manager")



module.exports.ToolFileManager = function () {
    this.registerOn = function (ipcMain, mainWin) {
        //选择文件并读取
        ipcMain.handle('file-manager-choose-read', async (event, args) => {
            const openRes = await dialog.showOpenDialog(mainWin, {
                title: '请选择文件',//对话框窗口的标题
                defaultPath: './',//对话框的默认展示路径
                buttonLabel: '确定',
                filters: [{ name: '文本文档', extensions: ['txt'] },],
                properties: ['openFile', 'dontAddToRecent'],
                message: '请设置您要保存的文件名称'
            })
            if (openRes.canceled) {
                return {
                    code: -1,
                    message: '取消选择'
                }
            }
            const filePath = openRes.filePaths[0]
            const fileHandle = await fsPromise.open(filePath)
            /*stat()返回的详细说明：https://juejin.cn/post/6955011872298893319*/
            const fileStat = await fileHandle.stat()
            const fileContent = await fileHandle.readFile("utf8") //读文件
            await fileHandle.close()
            return {
                code: 0,
                message: '',
                data: {
                    filePath: filePath,
                    fileStat: {
                        size: fileStat.size,//文件有多少个字节
                        atime: fileStat.atime,//文件最近一次被访问的时间戳
                        mtime: fileStat.mtime,//文件最近一次修改的时间戳
                        ctime: fileStat.ctime,//文件最近一次状态变动的时间戳
                        birthtime: fileStat.birthtime,//文件创建的时间戳
                    },
                    fileContent: fileContent,
                }
            }
        })
        //选择文件并保存
        ipcMain.handle('file-manager-choose-save', async (event, args) => {
            const openRes = await dialog.showSaveDialog(mainWin, {
                title: '保存文件',
                defaultPath: "",
                buttonLabel: '确定',
                filters: [{ name: '文本文档', extensions: ['txt'] },],
                properties: ['openFile', 'createDirectory', 'dontAddToRecent'],
                message: '请选择或创建您要打开的文本文档'
            })
            log.d("file-manager-choose-save", openRes)
            if (openRes.canceled) {
                return {
                    code: -1,
                    message: '取消选择'
                }
            }
            const filePath = openRes.filePath
            await fsPromise.writeFile(filePath, args.fileContent, "utf8") //写文件
            return {
                code: 0,
                message: 'ok',
                data: {
                    filePath: filePath
                }
            }
        })
        //TODO 以buffer的方式写入文件
        ipcMain.handle('file-manager-buffer-read',async(event,args)=>{

        })
        //TODO 以buffer的方式读取文件
        ipcMain.handle('file-manager-buffer-save',async(event,args)=>{

        })

    }

    this.unRegister = function (ipcMain) {
        ipcMain.removeHandler('file-manager-choose-read')
        ipcMain.removeHandler('file-manager-choose-save')
    }
}