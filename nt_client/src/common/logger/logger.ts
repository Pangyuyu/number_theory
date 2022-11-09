/**
 * 日志级别
 */
enum EnLogLevel {
  VERBOSE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
}
/**
 * 日志类
 */
export default class Logger {
  tag: string = "GuestIn";
  private static limitLevel: EnLogLevel = EnLogLevel.DEBUG; //限制的等级
  static setGlobalLevel(level: EnLogLevel) {
    Logger.limitLevel = level;
  }
  constructor(tag: string = "Guestin") {
    this.tag = tag;
  }
  /**
   * 字符串转换为日志等级枚举
   */
  str2Level(levelStr: string): EnLogLevel {
    let enLevel = EnLogLevel.DEBUG;
    switch (levelStr) {
      case "VERBOSE":
        enLevel = EnLogLevel.VERBOSE;
        break;
      case "DEBUG":
        enLevel = EnLogLevel.DEBUG;
        break;
      case "INFO":
        enLevel = EnLogLevel.INFO;
        break;
      case "WARN":
        enLevel = EnLogLevel.WARN;
        break;
      case "ERROR":
        enLevel = EnLogLevel.ERROR;
        break;
      case "FATAL":
        enLevel = EnLogLevel.FATAL;
        break;
    }
    return enLevel;
  }
  /**
   * 日志等级枚举转换为字符串
   */
  level2Str(logLevel: EnLogLevel): string {
    let levelStr = "";
    switch (logLevel) {
      case EnLogLevel.VERBOSE:
        levelStr = "VERB";
        break;
      case EnLogLevel.DEBUG:
        levelStr = "DEBUG";
        break;
      case EnLogLevel.INFO:
        levelStr = "INFO";
        break;
      case EnLogLevel.WARN:
        levelStr = "WARN";
        break;
      case EnLogLevel.ERROR:
        levelStr = "ERROR";
        break;
      case EnLogLevel.FATAL:
        levelStr = "FATAL";
        break;
    }
    return levelStr;
  }
  formatNumber(n: number): string {
    const s = n.toString();
    return s[1] ? s : "0" + s;
  }
  formatTime(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const ms = date.getMilliseconds();
    return (
      [year, month, day]
        .map((it: number) => {
          return this.formatNumber(it);
        })
        .join("-") +
      " " +
      [hour, minute, second]
        .map((it: number) => {
          return this.formatNumber(it);
        })
        .join(":") +
      "." +
      ms
    );
  }
  logOut(level: EnLogLevel, ...msg: Array<any>) {
    if (Logger.limitLevel > level) {
      return;
    }
    let now = new Date();
    let prefix = `${this.formatTime(now)} ${this.level2Str(level)} [${
      this.tag
    }]`;
    switch (level) {
      case EnLogLevel.VERBOSE:
        console.log(prefix, ...msg);
        break;
      case EnLogLevel.DEBUG:
        console.log(prefix, ...msg);
        break;
      case EnLogLevel.INFO:
        console.info(prefix, ...msg);
        break;
      case EnLogLevel.WARN:
        console.warn(prefix, ...msg);
        break;
      case EnLogLevel.ERROR:
        console.error(prefix, ...msg);
        break;
      case EnLogLevel.FATAL:
        console.error(prefix, ...msg);
        break;
    }
  }
  verbose(...msg: Array<any>) {
    this.logOut(EnLogLevel.VERBOSE, msg);
  }
  debug(...msg: Array<any>) {
    this.logOut(EnLogLevel.DEBUG, msg);
  }
  info(...msg: Array<any>) {
    this.logOut(EnLogLevel.INFO, msg);
  }
  warn(...msg: Array<any>) {
    this.logOut(EnLogLevel.WARN, msg);
  }
  error(...msg: Array<any>) {
    this.logOut(EnLogLevel.ERROR, msg);
  }
  fatal(...msg: Array<any>) {
    this.logOut(EnLogLevel.FATAL, msg);
  }
}
const gLog = new Logger("Default");
export {Logger, EnLogLevel, gLog };
