const path = require('path');
const {exec} = require('child_process');
const { NewOK, NewError } = require("../../utils/error")
const { Log } = require("../../utils/log");
const log = new Log().withTag("ls-linux")
const SERVER_NAME = "nunber-theory-local-server"
const {LOCAL_SERVER_MAGIC} =require("../../utils/sysConst")
/*参考资料：linux下进程、端口号相互查看方法*/

/**
 * Linux下的方法
 */
module.exports.LsLinux = function () {
    this.GetServerPath = function () {
        return path.resolve(".", "resources", "server", "nunber-theory-local-server")
    }
    this.GetServerDir = function () {
        return path.resolve(".", "resources", "server")
    }
    /**
     * 获取可执行文件名称
     */
    this.GetExecFileName = function () {
        return `${SERVER_NAME}`
    }
    this.IsRunning = function () {
        return new Promise((resolve, _) => {
            log.d("查询服务是否运行")
            const taskName = this.GetExecFileName()
            // let cmd = `ps -ef | grep ${taskName} | grep -v grep` //这个为什么不行？
            const cmd=`ps -ef | grep ${taskName}`
            log.d("命令",cmd)
            exec(cmd, (err, stdout, stderr) => {
                log.d("命令输出",stdout)
                if (err) {
                    log.e("命令执行失败",err)
                    resolve(NewError("命令执行失败!"+err.message))
                    return
                }
                let targetPid = -1
                stdout.split('\n').filter(line => {
                    log.d(line)
                    if(line.indexOf("grep")==-1){
                        let processMessage = line.trim().split(/\s+/)
                        if (line.indexOf(taskName) > -1) {
                            targetPid = processMessage[1]
                        }
                    }                    
                })
                if (targetPid == -1) {
                    resolve(NewError("本地服务未启动!"))
                    return
                }
                resolve(NewOK({
                    pid: targetPid
                }))
            })
        })
    }
    this.PortIsFreetime = function (port) {
        return new Promise((resolve, _) => {
            const cmd = `lsof -i:${port}`
            exec(cmd, (_, stdout, __) => {
                log.d("查询输出:", stdout)
                const isFree = stdout == undefined || stdout == null || stdout.length == 0
                resolve(NewOK({
                    free: isFree
                }))
            })
        })
    }
    this.ChildProcessStart = function (port) {
        return new Promise((resolve, _) => {
            const command = `./${this.GetExecFileName()} -p ${port} -m ${LOCAL_SERVER_MAGIC}`
            log.d("启动命令",command)
            const options = {
                cwd: this.GetServerDir(),
                windowsHide: false,
            }
            exec(command, options, (error, stdout, stderr) => {
                log.d("cprocess.exec error", error)
                log.d("cprocess.exec stdout", stdout)
                log.d("cprocess.exec stderr", stderr)
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