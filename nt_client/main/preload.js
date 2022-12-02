// electron/preload.js
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron')

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true' /*去掉控制台关于security的警告*/
/*这是正确的写法，原先把主进程中的对象全部挂载在window上是错误的做法*/

/**
 * 主进程<-->渲染进程的方法，定义在PreloadApi.ts中
 */
contextBridge.exposeInMainWorld('EPre', {
    /*ipcRenderer方法
    1.invoke，异步调用，渲染进程需要使用async/await进行调用；主进程使用handle方法;
    2.send,同步调用，主进程使用on方法，不需要向渲染进程发回调；
    3.on,异步调用，主进程主动向渲染进程发送数据,渲染进程需要注册回调函数，主进程需要使用mainWin.webContents.send；
    */
    onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
    appExit: () => ipcRenderer.send("app-exit", {}),
    appTitle: (title) => ipcRenderer.send("app-title", { title: title }),
    appCopy: (text) => ipcRenderer.send("app-copy", { text: text }),
    appInfo: () => ipcRenderer.invoke("app-info", {}),
    appIsDebug: () => ipcRenderer.invoke("app-isDebug", {}),
    firmwareChoose: () => ipcRenderer.invoke('fireware-zip-choose', {}),
    localServerStart: () => ipcRenderer.invoke("local-server-start", {}),
    localServerStop: () => ipcRenderer.invoke("local-server-stop", {}),
    localServerState: () => ipcRenderer.invoke("local-server-state", {}),
    localServerPort: () => ipcRenderer.invoke("local-server-port", {}),
    fileDown: (url, fileName, fileMd5, tag) => ipcRenderer.invoke("file-down", {
        url: url,
        name: fileName,
        md5: fileMd5,
        tag: tag
    }),
    fileDownSilence: (url, filePath, fileMd5, tag) => ipcRenderer.invoke("file-down-silence", {
        url: url,
        path: filePath,
        md5: fileMd5,
        tag: tag,
    }),
    onFileDownReply: (callback) => ipcRenderer.on('file-down-reply', callback),
    directoryOpen: (dirPath) => ipcRenderer.invoke("directory-open", { dirPath: dirPath }),
    fileMd5Checked: (filePath, targetMd5) => ipcRenderer.invoke("file-md5-check", { filePath: filePath, md5: targetMd5 }),
    firmwareExist: (repo, version, md5) => ipcRenderer.invoke("fireware-exists", { repo: repo, version: version, md5: md5 }),
    appSafeEncrypt: (plainText) => ipcRenderer.invoke("app-safe-encrypt", { plainText: plainText }),
    appSafeDecrypt: (encrypted) => ipcRenderer.invoke("app-safe-decrypt", { encrypted: encrypted }),
    dbQueryPrimeByIndex: (start, end) => ipcRenderer.invoke("db-query-prime-byindex", { start: start, end: end }),
    dbQueryPrimeInterval: (start, end) => ipcRenderer.invoke("db-query-prime-interval", { start: start, end: end }),
    dbQueryPrimeFirstSpacing:(start, end)=>ipcRenderer.invoke("db-query-prime-first-spacing", { start: start, end: end }),
    dbQueryPrimeSpacingStat:(start, end)=>ipcRenderer.invoke("db-query-prime-spacing-stat", { start: start, end: end }),
    collatzGetSequence:(value)=>ipcRenderer.invoke("collatz-getSequence",{value:value})
})
