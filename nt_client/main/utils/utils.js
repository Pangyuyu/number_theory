const _title_base = "number_theory"
const { stat } = require("fs");
const { NewError, NewOK } = require("./error");
const fs = require("fs")
const crypto = require('crypto');
const { Log } = require("../utils/log")
const log = new Log().withTag("utils/utils.js")
var Utils = function () {
    this.LocalUrl = "http://localhost:3000";
    this.getTitle = function (title) {
        if (title && title.length > 0) {
            return _title_base + " " + title
        }
        return _title_base
    },
        this.isEmpty = function (str) {
            return !this.isNotEmpty(str);
        },
        this.isNotEmpty = function (str) {
            return str != null && (str + '').trim().length > 0;
        }
    this.fileExist = function (filePath) {
        return new Promise((resolve, _) => {
            stat(filePath, (err, stats) => {
                if (err) {
                    resolve(NewError("文件或目录不存在!"))
                    return
                }
                resolve(NewOK())
            })
        })
    }
    /**
     * 校验MD5
     * @param {string} filePath 文件路径
     * @param {string} md5 对比的MD5
     * @returns 
     */
    this.checkMd5 = function (filePath, targetMd5) {
        return new Promise((resolve, _) => {
            const stream = fs.createReadStream(filePath);
            const hash = crypto.createHash('md5');
            stream.on('data', chunk => {
                hash.update(chunk, 'binary');
            });
            stream.on('end', () => {
                const curMd5 = hash.digest('hex');
                log.d("下载文件MD5", curMd5)
                if (curMd5.toUpperCase() == targetMd5.toUpperCase()) {
                    resolve(NewOK(""))
                } else {
                    resolve(NewError("MD5校验不通过!"))
                }
            });
        })
    }
}
module.exports = new Utils()