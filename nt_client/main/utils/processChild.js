//封装和child_process相关的方法
const cprocess = require('child_process');
const utils = require('./utils');
const { NewOK, NewError } = require("./error")
var ProcessChild=function(){
    this.RunExec=function(cmd){
        return new Promise((resolve, _)=>{
            cprocess.exec(cmd,(err,stdout,stderr)=>{
                if (err) {
                    resolve(NewError(err.message))
                    return
                }
                let lines=[]
                if(utils.isNotEmpty(stdout)){
                    lines=stdout.split("\n")
                }
                resolve(NewOK(lines))
            })
        })
    }
}

module.exports=new ProcessChild()