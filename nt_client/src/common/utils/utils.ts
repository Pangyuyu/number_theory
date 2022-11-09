class Utils {
    isEmpty(str: string | null): boolean {
        return !this.isNotEmpty(str);
    }
    isNotEmpty(str: string | null): boolean {
        return str != null && (str + '').trim().length > 0;
    }
    /**
     * 生成UUID v4
     */
    UUID(rmSp: boolean = false): string {
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        if (rmSp) {
            return uuid.replace(/-/g, '')
        } else {
            return uuid
        }
    }
    tryParseJson(jsonStr: any, defaultRet: any = {}) {
        if (!jsonStr || jsonStr == '') {
            return defaultRet
        }
        try {
            let ret = JSON.parse(jsonStr)
            return ret || defaultRet
        } catch (ex) {
            return defaultRet
        }
    }
    /**
     * 获取文件大小,保留两位小数
     * @param {number}} size 文件大小（byte）
     */
    computeFileSize(size: number) {
        if (size == undefined || size == null) {
            return "0字节";
        }
        if (size > 1048576) {
            return (size / 1048576).toFixed(2) + "MB";
        }
        if (size > 1024) {
            return (size / 1024).toFixed(2) + "KB";
        }
        return size + "字节";
    }
    /**
   * @param {long} timestamp
   * @param {string} fmt 默认为yyyy-MM-dd
   */
    timestamp2Str(timestamp, fmt = "yyyy-MM-dd") {
        if (timestamp == undefined || timestamp == null) {
            return "";
        }
        let ts = timestamp;
        if ((timestamp + "").length == 10) {
            ts = ts * 1000;
        }
        let date = new Date(ts);
        let o = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "h+": date.getHours(), // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (date.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1 ?
                        o[k] :
                        ("00" + o[k]).substr(("" + o[k]).length)
                );
            }
        }
        return fmt;
    }
    randomNum(min:number,max:number):number{
        const rm=Math.random()*(max-min+1)+min
        return parseInt(rm+"",10);
    }
}
const utils = new Utils();
export default utils;
