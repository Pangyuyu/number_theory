
import PreLoadApi from './main/PreloadApi'
export { };
declare global {
  interface Window {
    /**
     * Electron主进程方法，具体实现在"main/preload.js"中
     */
    EPre: PreLoadApi;
  }
  interface Navigator{
    serial:any
  }
}