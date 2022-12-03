const { NewOK, NewError } = require("../utils/error")
const toolSqlite = require("./tool-sqlite")
class ToolCollatz {
    registerOn(ipcMain, mainWin) {
        ipcMain.handle("collatz-getSequence", async (event, args) => {
            let seqList = []
            let value = args.value
            //先从数据库中查询
            const sql = `select no,seqvalue as value from tb_collatz_seq tcs where tcs."no" =${value}`
            const queryRes = await toolSqlite.queryQll(sql)
            // console.log("查询结果", queryRes)
            if (queryRes.data.length > 0) {
                seqList = queryRes.data.map(it => {
                    return it.value
                })
            } else {
                //若数据库中没有，则直接计算
                seqList.push(value)
                while (value != 1) {
                    if (value % 2 == 0) {
                        value = value / 2
                    } else {
                        value = 3 * value + 1
                    }
                    seqList.push(value)
                }
                //存储在数据库中
                let sqlList=["insert into tb_collatz_seq(no,seqvalue) values "]
                const endNum=seqList.length-1
                for(let i=0;i<seqList.length;i++){
                    sqlList.push(`(${args.value},${seqList[i]})`)
                    if(i<endNum){
                        sqlList.push(",")
                    }
                }
                sqlList.push(";")
                let allSql=sqlList.join(" ")
                // console.log("sql",allSql)
                await toolSqlite.run(allSql,{})
            }
            return NewOK(seqList)
        })
        ipcMain.handle("collatz-curcalc-maxno",async(event,args)=>{
            const sql = `select max(no) as maxNo from tb_collatz_seq tcs`
            const queryRes = await toolSqlite.queryQll(sql)
            console.log("queryRes",queryRes)
            if(queryRes.isFail){
                return queryRes
            }
            if(queryRes.data.length==0){
                return NewError("数据库中暂无数据")
            }
            return NewOK({
                maxNo:queryRes.data[0].maxNo
            })
        })
    }
    unRegister(ipcMain) {
        ipcMain.removeHandler("collatz-getSequence")
        ipcMain.removeHandler("collatz-curcalc-maxno")
    }
}

module.exports = new ToolCollatz()