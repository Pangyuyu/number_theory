const sqlite3 = require("sqlite3").verbose()
const { Log } = require("../utils/log")
const log = new Log().withTag("tool-sqlite")
const { NewOK, NewError } = require("../utils/error")
// let dbFile = '../../../table/theory'
const dbFile = "C:\\Users\\xuan\\Documents\\code_my\\number_theory\\table\\theory"
let db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        log.e("打开数据库失败", err)
        return
    }
    log.d("打开数据库成功")
})
// function queryQll(sql) {
//     return new Promise((resolve, __) => {
//         db.all(sql, (err, rows) => {
//             if (err) {
//                 resolve(NewError(err.message)) 
//                 return 
//             }
//             resolve(NewOK(rows)) 
//         })
//     })
// }
class ToolDbTheory {
    registerOn(ipcMain, mainWin) {
        ipcMain.handle("db-query-prime-byindex",async (event, args) => {
            const sql = `SELECT "number" as "no",value from tb_prime where "number">${args.start} AND  "number"<=${args.end}`
            console.log("sql",sql)
            const queryRes=await this.queryQll(sql)
            return queryRes
        })
        ipcMain.handle("db-query-prime-interval",async(event,args)=>{
            const sql = `SELECT tp1.n1 as 'no',(tp2.v2-tp1.v1) as value from (select "number" AS n1, value as v1 from tb_prime where "number">=${args.start} and "number" <=${args.end}) as tp1
            LEFT JOIN (select "number" AS n2, value as v2 from tb_prime where "number">=${args.start} and "number" <=${args.end+1}) as tp2 on tp2.n2=tp1.n1+1`
            console.log("sql",sql)
            const queryRes=await this.queryQll(sql)
            return queryRes
        })
        ipcMain.handle("db-query-prime-first-spacing",async(event,args)=>{
            const sql = `SELECT diff as "no" ,no as value from tb_prime_spacing tps where tps.diff>=${args.start} and tps.diff<=${args.end} order by tps.diff asc`
            console.log("sql",sql)
            const queryRes=await this.queryQll(sql)
            return queryRes
        })
        ipcMain.handle("db-query-prime-spacing-stat",async(event,args)=>{
            const sql = `SELECT  diff as no,count as value from tb_prime_spacing tps where tps.diff>=${args.start} and tps.diff<=${args.end}`
            console.log("sql",sql)
            const queryRes=await this.queryQll(sql)
            return queryRes
        })
    }
    queryQll(sql) {
        return new Promise((resolve, __) => {
            db.all(sql, (err, rows) => {
                if (err) {
                    resolve(NewError(err.message)) 
                    return 
                }
                resolve(NewOK(rows)) 
            })
        })
    }
    unRegister(ipcMain) {
        ipcMain.removeHandler("db-query-prime-byindex")
        ipcMain.removeHandler("db-query-prime-interval")
        ipcMain.removeHandler("db-query-prime-first-spacing")
        ipcMain.removeHandler("db-query-prime-spacing-stat")
    }
}

module.exports = new ToolDbTheory()
