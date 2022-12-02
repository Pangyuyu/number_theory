const toolSqlite=require("./tool-sqlite")
class ToolPrime{
    registerOn(ipcMain, mainWin) {
        ipcMain.handle("db-query-prime-byindex",async (event, args) => {
            const sql = `SELECT "number" as "no",value from tb_prime where "number">${args.start} AND  "number"<=${args.end}`
            // console.log("sql",sql)
            const queryRes=await toolSqlite.queryQll(sql)
            return queryRes
        })
        ipcMain.handle("db-query-prime-interval",async(event,args)=>{
            const sql = `SELECT tp1.n1 as 'no',(tp2.v2-tp1.v1) as value from (select "number" AS n1, value as v1 from tb_prime where "number">=${args.start} and "number" <=${args.end}) as tp1
            LEFT JOIN (select "number" AS n2, value as v2 from tb_prime where "number">=${args.start} and "number" <=${args.end+1}) as tp2 on tp2.n2=tp1.n1+1`
            // console.log("sql",sql)
            const queryRes=await toolSqlite.queryQll(sql)
            return queryRes
        })
        ipcMain.handle("db-query-prime-first-spacing",async(event,args)=>{
            const sql = `SELECT diff as "no" ,no as value from tb_prime_spacing tps where tps.diff>=${args.start} and tps.diff<=${args.end} order by tps.diff asc`
            // console.log("sql",sql)
            const queryRes=await toolSqlite.queryQll(sql)
            return queryRes
        })
        ipcMain.handle("db-query-prime-spacing-stat",async(event,args)=>{
            const sql = `SELECT  diff as no,count as value from tb_prime_spacing tps where tps.diff>=${args.start} and tps.diff<=${args.end}`
            // console.log("sql",sql)
            const queryRes=await toolSqlite.queryQll(sql)
            return queryRes
        })
    }
    unRegister(ipcMain) {
        ipcMain.removeHandler("db-query-prime-byindex")
        ipcMain.removeHandler("db-query-prime-interval")
        ipcMain.removeHandler("db-query-prime-first-spacing")
        ipcMain.removeHandler("db-query-prime-spacing-stat")
    }
}
module.exports=new ToolPrime()