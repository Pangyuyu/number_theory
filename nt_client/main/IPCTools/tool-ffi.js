const { NewOK, NewError } = require("../utils/error")
class Toolffi {
    registerOn(ipcMain, mainWin) {
        ipcMain.handle("collatz-getSequence", async (event, args) => {
            let seqList = []
            let value = args.value
            seqList.push(value)
            while (value != 1) {
                if (value % 2 == 0) {
                    value = value / 2
                } else {
                    value = 3 * value + 1
                }
                seqList.push(value)
            }
            return NewOK(seqList)
        })
    }
    unRegister(ipcMain) {

    }
}

module.exports = new Toolffi()