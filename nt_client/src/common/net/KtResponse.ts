export default class KtResponse {
    httpStatusCode: number = -1;
    message: string = '';
    headers: any = {};
    body: any = {};
    isSuccess: boolean = false;
    isFail: boolean = !this.isSuccess;
    isAbort: boolean = false;
    withStatus(status: number): KtResponse {
        this.httpStatusCode = status;
        return this;
    }
    withMessage(message: string): KtResponse {
        this.message = message;
        return this;
    }
    withHeader(headers: any): KtResponse {
        this.headers = headers;
        return this;
    }
    withBody(body: any): KtResponse {
        this.body = body;
        return this;
    }
    withSuccess(isSuccess: boolean): KtResponse {
        this.isSuccess = isSuccess;
        return this;
    }
    withAbort(isAbort: boolean): KtResponse {
        this.isAbort = isAbort;
        return this;
    }
}
