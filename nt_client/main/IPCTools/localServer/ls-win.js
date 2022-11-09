const path = require('path');
const cprocess = require('child_process');
const { NewOK, NewError } = require("../../utils/error")
const { Log } = require("../../utils/log");
const log = new Log().withTag("ls-win")
const processChild = require("../../utils/processChild")
const SERVER_NAME = "nunber-theory-local-server"
const {LOCAL_SERVER_MAGIC} =require("../../utils/sysConst")
module.exports.LsWin = function () {
    /**
     * 获取服务文件地址
     */
    this.GetServerPath = function () {
        return path.resolve(".", "resources", "server", `${SERVER_NAME}.exe`)
    }
    this.GetServerDir = function () {
        return path.resolve(".", "resources", "server")
    }
    /**
     * 获取可执行文件名称
     */
    this.GetExecFileName = function () {
        return `${SERVER_NAME}.exe`
    }

    /* 需要返回的信息：
    1.taskName
    2.pid
    3.port
    */
    this.IsRunning = function () {
        return new Promise(async (resolve, _) => {
            const taskName = this.GetExecFileName()
            //根据名称搜索进程
            let cmd = `tasklist /fi "IMAGENAME eq ${taskName}"`
            const taskRes = await processChild.RunExec(cmd)
            if (taskRes.isFail) {
                resolve(taskRes)
                return
            }
            let targetPid = -1
            taskRes.data.forEach(line => {
                let processMessage = line.trim().split(/\s+/)
                if (line.indexOf(taskName) > -1) {
                    targetPid = processMessage[1]
                }
            })
            if (targetPid == -1) {
                resolve(NewError("本地服务未启动!"))
                return
            }
            //根据PID搜索占用端口号 netstat -ano | findStr 5680
            cmd = `netstat -ano | findStr ${targetPid}`
            const findRes = await processChild.RunExec(cmd)
            if (findRes.isFail) {
                resolve(taskRes)
                return
            }
            let port = -1
            findRes.data.forEach(line => {
                //'TCP', '0.0.0.0:30784', '0.0.0.0:0', 'LISTENING', '10500'
                let findMsg = line.trim().split(/\s+/)
                if (findMsg.length >= 2 && findMsg[0] == 'TCP') {
                    const secArrs = findMsg[1].split(":")
                    port = secArrs[secArrs.length - 1]
                }
                // log.d("搜索结果", findMsg)
            })
            resolve(NewOK({
                taskName: taskName,
                pid: targetPid,
                port: port
            }))
        })
    }
    this.PortIsFreetime = function (port) {
        return new Promise((resolve, _) => {
            const cmd = `netstat -aon|findstr "${port}"`
            cprocess.exec(cmd, (_, stdout, __) => {
                // log.d("查询输出:", stdout)
                const isFree = stdout == undefined || stdout == null || stdout.length == 0
                resolve(NewOK({
                    free: isFree
                }))
            })
        })
    }
    this.ChildProcessStart = function (port) {
        return new Promise((resolve, _) => {
            const command = `.\\${this.GetExecFileName()} -p ${port} -m ${LOCAL_SERVER_MAGIC}`
            const options = {
                cwd: this.GetServerDir(),
                windowsHide: false,
            }
            cprocess.exec(command, options, (error, stdout, stderr) => {
                // log.d("cprocess.exec error",error)
                // log.d("cprocess.exec stdout",stdout)
                // log.d("cprocess.exec stderr",stderr)
                if (error) {
                    log.e(error)
                    resolve(NewError(error.message))
                    return
                }
                if (stdout != undefined && stdout != null && stdout.length > 0) {
                    resolve(NewOK("启动成功!"))
                    return
                }
                resolve(NewError("启动失败!"))
            })
        })
    }
}