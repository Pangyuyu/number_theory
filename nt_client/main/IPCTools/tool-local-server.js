
/*参考文档：
1.Node.js v18.4.0 文档 child_process
    http://nodejs.cn/api/child_process.html
2.nodejs启动其他程序的封装
    https://blog.csdn.net/foren_whb/article/details/109533750
3.cprocess.execFile 回调不走
    真正的原因是 child_process.exec 的 timeout 默认是 0，这样回调永远不会走。
4.TODO 本地服务需要支持：windows,linux,mac
*/
const { LsLinux } = require("./localServer/ls-linux")
const { LsWin } = require("./localServer/ls-win")
const { LsMac } = require("./localServer/ls-mac")
const { Log } = require("../utils/log")
const { NewOK, NewError } = require("../utils/error")
const log = new Log().withTag("tool-local-server")
var _CUR_PORT = -1 //当前使用的端口号
var _CUR_PID = -1;//当前服务使用的进程ID号
var localServer = null
var serverPath = ""


const minNum = 30000
const maxNum = 65535
function radomPort() {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}
function delayCheckRuning() {
    return new Promise((resolve, _) => {
        setTimeout(async () => {
            runRes = await localServer.IsRunning()
            // log.d("localServer.IsRunning", runRes)
            resolve(runRes)
        }, 200)
    })
}
async function stopLocalServer() {
    const runRes = await localServer.IsRunning()
    if (runRes.isFail) {
        return NewError("本地服务尚未启动")
    }
    try {
        process.kill(runRes.data.pid)
    } catch (ex) {
        log.e(ex)
    }
    return NewOK("")
}
class ToolLocalServer {
    /**
     * 初始化
     */
    Init() {
        if (localServer != null) {
            return
        }
        log.d("当前操作系统", process.platform)
        const ppf = process.platform
        switch (ppf) {
            case "win32":
                localServer = new LsWin();
                break;
            case "linux":
                localServer = new LsLinux();
                break;
            case "darwin":
                localServer = new LsMac();
                break;
            default:
                localServer = null
                break;
        }
        if (localServer) {
            serverPath = localServer.GetServerPath()
        } else {
            log.d("==不支持此操作系统==")
        }
    }
    registerOn (ipcMain, mainWin) {
        ipcMain.handle('local-server-start', async (event, args) => {
            if (localServer == null) {
                return NewError("本地服务未初始化")
            }
            const runRes = await localServer.IsRunning()
            if (runRes.isOk) {
                log.d("已运行的服务结果",runRes)
                _CUR_PORT = runRes.data.port
                _CUR_PID = runRes.data.pid
                return NewOK(runRes)
            }
            let targetPort = -1
            //随机十次端口号，挑选可用的
            for (let i = 0; i < 10; i++) {
                const rPort = radomPort()
                // log.d("随机端口号", rPort)
                const portFreeRes = await localServer.PortIsFreetime(rPort)
                // log.d("端口号空闲查询", portFreeRes)
                if (portFreeRes.data.free) {
                    targetPort = rPort
                    break
                }
            }
            if (targetPort == -1) {
                return NewError("当前无可用端口号!")
            }
            localServer.ChildProcessStart(targetPort)
            let targetPid = -1
            for (let i = 0; i < 100; i++) {
                const checkRes = await delayCheckRuning()
                if (checkRes.isOk) {
                    targetPid = checkRes.data.pid
                    break
                }
            }

            _CUR_PORT = targetPort
            _CUR_PID = targetPid
            return NewOK({
                port: _CUR_PORT,
                pid: _CUR_PID
            })
        })
        ipcMain.handle('local-server-stop', async (event, args) => {
            const stopRes = stopLocalServer()
            return stopRes
        })
        ipcMain.handle('local-server-state', async (event, args) => {
            if (localServer == null) {
                return NewError("本地服务未初始化")
            }
            const runRes = await localServer.IsRunning()
            if (runRes.isFail) {
                return runRes
            }
            _CUR_PID=runRes.data.pid
            _CUR_PORT=runRes.data.port
            return NewOK({
                isRunning: true,
                pid: _CUR_PID,
                port: _CUR_PORT
            })
        })
        ipcMain.handle('local-server-port', async (event, args) => {
            if (localServer == null) {
                return NewError("本地服务未初始化")
            }
            //查询本地服务是否启动
            const runRes = await localServer.IsRunning()
            if (runRes.isFail) {
                return runRes
            }
            return NewOK({
                port: _CUR_PORT
            })
        })
    }
    stopChildProcess() {
        return new Promise(async (resolve, __) => {
            log.d("===停止本地服务===")
            const runRes = await localServer.IsRunning()
            if (runRes.isOk) {
                try {
                    process.kill(runRes.data.pid)
                } catch (ex) {
                    log.e(ex)
                }
            }
            resolve(NewOK({}))
        })
    }

    unRegister(ipcMain) {
        ipcMain.removeHandler('local-exe-start')
        ipcMain.removeHandler('local-exe-stop')
        ipcMain.removeHandler('local-exe-state')
        ipcMain.removeHandler('local-exe-port')
    }
}
module.exports=new ToolLocalServer()