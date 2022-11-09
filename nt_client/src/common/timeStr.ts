// 格式化时间
export function timeStr(time: Date): string {
    const date: Date = new Date(time)
    // 年
    const y: number | string = date.getFullYear()
    // 月
    let m: number | string = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    // 日
    let d: number | string = date.getDate()
    d = d < 10 ? ('0' + d) : d
    // 时
    let h: number | string = date.getHours()
    h = h < 10 ? ('0' + h) : h
    // 分
    let mm: number | string = date.getMinutes()
    mm = mm < 10 ? ('0' + mm) : mm
    // 秒
    let s: number | string = date.getSeconds()
    s = s < 10 ? ('0' + s) : s
    return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
}
