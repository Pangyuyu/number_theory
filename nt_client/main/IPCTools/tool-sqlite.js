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
class ToolDbTheory {    
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
    run(sql,params){
        return new Promise((resolve,__)=>{
            db.run(sql,params,(err)=>{
                if(err){
                    resolve(NewError(err.message))
                    return
                }
                resolve(NewOK({}))
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
