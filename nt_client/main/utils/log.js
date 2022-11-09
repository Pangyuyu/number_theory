/*注意这个Log只用于主进程*/
/**
 * 日志封装
 */
module.exports.Log = function () {
    tag: "主进程";
    this.withTag = function (tag) {
        this.tag=tag
        return this;
    }

    this.l = function (...msg) {
        console.log(this.tag, msg)
    }
    this.d = function (...msg) {
        console.debug(this.tag,msg)
    }
    this.e = function (...msg) {
        console.error(this.tag,msg)
    }

}