import Logger from "@/common/logger/logger";
import axios from "axios";
import IRespInterceptor from "@/common/net/IRespInterceptor";
import KtRequest from "@/common/net/KtRequest";
import KtResponse from "@/common/net/KtResponse";
import querystring from "querystring";
const statusCodeMap: any = new Map([
  [
    400,
    {
      en: "Bad request",
      cn: "请求参数错误",
    },
  ],
  [
    401,
    {
      en: "Unauthorized",
      cn: "未授权的请求",
    },
  ],
  [
    403,
    {
      en: "Forbidden",
      cn: "权限不足",
    },
  ],
  [
    404,
    {
      en: "Not Found",
      cn: "请求路径不存在",
    },
  ],
  [
    405,
    {
      en: "Method Not Allowed",
      cn: "请求方法不正确",
    },
  ],
  [
    500,
    {
      en: "Server Internal Error",
      cn: "服务器异常,请稍后再试(500)",
    },
  ],
  [
    501,
    {
      en: "Not Implemented",
      cn: "服务器异常,请稍后再试(501)",
    },
  ],
  [
    502,
    {
      en: "Bad Gateway",
      cn: "服务器繁忙,请稍后再试(502)",
    },
  ],
  [
    503,
    {
      en: "Service Unavailable",
      cn: "服务器繁忙,请稍后再试(503)",
    },
  ],
  [
    504,
    {
      en: "Gateway Timeout",
      cn: "服务器繁忙,请稍后再试(504)",
    },
  ],
]);
class RequestBase {
  private __logger: Logger = new Logger("requestBase");
  private __endpoint: string = "";
  private __method?: "GET" | "POST" | "PUT" | "DELETE";
  private __path: string = "";
  private __headers: any = {};
  private __querys: any;
  private __dataType: string = "json";
  private __body: any = null;
  private __multipartFile: any = null;
  private __timeout: number = 15000;
  private __contentType: string = "";
  private __onUploadProgress:any;
  // private __formData: any=new Map();
  // private __showLoading: boolean= false;
  // __loading: defaultLoading(),
  // private __loadingTitle: string='';
  // private __loadingMask:boolean= true;
  // private __loadingDelayClose: number= 500;
  // private __requestInterceptors: any=new Map();
  private __responseInterceptors: any = new Map();
  /**
   * 设置调用的endpoint
   */
  withEndpoint(endpoint: string): RequestBase {
    this.__endpoint = endpoint;
    return this;
  }
  /**
   * 设置请求方法
   */
  private withMethod(method?: "GET" | "POST" | "PUT" | "DELETE"): RequestBase {
    this.__method = method;
    return this;
  }
  /**
   * 设置resonse 拦截器
   */
  setupResponseInterceptor(name: string, func: IRespInterceptor) {
    if (name && func) {
      this.__responseInterceptors.set(name, func);
    }
    return this;
  }
  GET(): RequestBase {
    return this.withMethod("GET");
  }
  POST(): RequestBase {
    return this.withMethod("POST");
  }
  PUT(): RequestBase {
    return this.withMethod("PUT");
  }
  DELETE() {
    return this.withMethod("DELETE");
  }
  withPath(path: string): RequestBase {
    this.__path = path;
    return this;
  }
  withHeaders(key: string, value: any): RequestBase {
    if (key) {
      this.__headers[key] = value;
    }
    return this;
  }
  withBearerToken(token: string): RequestBase {
    return this.withHeaders("Authorization", `Bearer ${token}`);
  }
  withQuery(querys: any): RequestBase {
    this.__querys = querys;
    return this;
  }
  withDataType(dataType: string): RequestBase {
    this.__dataType = dataType;
    return this;
  }
  withBody(body: any): RequestBase {
    this.__body = body;
    return this;
  }
  withMultiPartFile(filePath: any, fileName: string = "file"): RequestBase {
    this.__multipartFile = {
      filePath: filePath,
      name: fileName,
    };
    return this;
  }
  /**
   * 设置超时时间
   */
  withTimeout(timeout: number): RequestBase {
    this.__timeout = timeout;
    return this;
  }
  /**
   * 设置自定义的 content-type 请求头
   */
  withContentType(contentType: string): RequestBase {
    this.__contentType = contentType;
    return this;
  }
  withOnUploadProgress(onUploadProgress:any){
    this.__onUploadProgress=onUploadProgress
    return this
  }
  private buildUrl(endpoint: string, path: string, queryParams: any): string {
    let queryStr = querystring.stringify(queryParams);
    if (queryStr && queryStr.length > 0) {
      return `${endpoint}${path}?${queryStr}`;
    }
    return `${endpoint}${path}`;
  }

  /**
   * 组装参数
   */
  private build(): KtRequest {
    let url = this.buildUrl(this.__endpoint, this.__path, this.__querys);
    return new KtRequest()
      .withUrl(url)
      .withMethod(this.__method ? this.__method : "GET")
      .withData(this.__body)
      .withTimeout(this.__timeout)
      .withHeader(this.__headers)
      .withDataType(this.__dataType);
  }
  exec() {
    let req = this.build();
    return new Promise(async (resolve: any, _: any) => {
      let response = new KtResponse();
      let httpRes: any;
      if (this.__multipartFile != null) {
        const param = new FormData();
        param.append(this.__multipartFile.name, this.__multipartFile.filePath);
        if (this.__body) {
          Object.keys(this.__body).forEach((key) => {
            param.append(key, this.__body[key]);
          });
        }
        req.data = param;
        if(this.__onUploadProgress){
          req.onUploadProgress=this.__onUploadProgress
        }
      }
      httpRes = await this.httpRequest(req);
      if (httpRes.err) {
        const message = httpRes.err.message;
        response.withSuccess(false).withMessage(message);
      } else {
        let success = this.ensureHttpSuccess(httpRes.res.statusCode);
        let msg: string = "";
        if (!success) {
          msg = this.statusCode2Message(httpRes.res.statusCode);
        }
        response
          .withSuccess(true)
          .withStatus(httpRes.res.statusCode)
          .withBody(httpRes.res.data)
          .withHeader(httpRes.res.header || {})
          .withMessage(msg);
      }
      for (let [name, func] of this.__responseInterceptors) {
        func(req, response);
      }
      resolve(response);
    });
  }
  private ensureHttpSuccess(statusCode: number) {
    return statusCode >= 200 && statusCode <= 209;
  }
  private statusCode2Message(statusCode: number): string {
    if (this.ensureHttpSuccess(statusCode)) {
      return "OK";
    }
    if (statusCodeMap.has(statusCode)) {
      return statusCodeMap.get(statusCode).cn;
    }
    return statusCode + "";
  }
  private httpRequest(req: any): any {
    return new Promise((resolve: any, _: any) => {
      axios
        .request(req)
        .then((res) => {
          resolve({
            err: null,
            res: res,
          });
        })
        .catch((err) => {
          this.__logger.error("接口访问异常", err);
          resolve({
            err: err,
            res: null,
          });
        });
    });
  }
}

class Http {
  static init(endPoint: string): RequestBase {
    return new RequestBase().withEndpoint(endPoint);
  }
}

export { Http };
