

import Logger from "@/common/logger/logger";
import { Http } from "@/common/net/RequestBase";
import KtRequest from "@/common/net/KtRequest";
import KtResponse from "@/common/net/KtResponse";
import utils from "@/common/utils/utils";
const log = new Logger("KT_API_BASE");
/**
 * 通用API基础，这里的都是不需要设置Session
 */
export default class ApiBase {
  private static endpoint: string = "";
  private static sessionId: string = "";

  private static init(apiPath: string): any {
    let builder = Http.init(ApiBase.endpoint)
      .withPath(apiPath)
      .withTimeout(30 * 1000)
      .setupResponseInterceptor(
        "body_data_parser",
        (req: KtRequest, response: KtResponse): void => {
          if (response.isSuccess) {
            let bodyData =
              typeof response.body == "object"
                ? response.body
                : utils.tryParseJson(response.body, {
                    code: -1,
                    message: "服务器返回数据不是json格式",
                  });
            response.body = bodyData;
            if (bodyData) {
              let code = response.body.code;
              response.isSuccess = code == 0;
              response.isFail = code != 0;
              response.message = response.body.message;
            }
          }
        }
      );
    return builder;
  }
  static setupEndpoint(endpoint: string) {
    ApiBase.endpoint = endpoint;
  }
  static setupSessionId(sessionId: string) {
    if (sessionId !== ApiBase.sessionId) {
      log.debug("update sessionId", "from", ApiBase.sessionId, "to", sessionId);
      ApiBase.sessionId = sessionId;
    }
  }
  static GET(apiPath: string): any {
    return ApiBase.init(apiPath).GET();
  }
  static POST(apiPath: string): any {
    return ApiBase.init(apiPath).POST();
  }
  static DELETE(apiPath: string): any {
    return ApiBase.init(apiPath).DELETE();
  }
  static PUT(apiPath: string): any {
    return ApiBase.init(apiPath).PUT();
  }
}
