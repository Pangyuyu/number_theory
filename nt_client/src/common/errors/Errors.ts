export default class Errors {
    static readonly ERR_OK: number = 0; //成功
    static readonly ERR_NORMAL: number = 1; //一般错误
    code: number = Errors.ERR_NORMAL;
    message: string = '';
    data: any = {};
    isSuccess: boolean = false;
    isFail: boolean = true;
    constructor(code: number, message?: string, data?: any | null) {
        this.code = code;
        if (message) {
            this.message = message;
        }
        if (data) {
            this.data = data;
        }
        this.isSuccess = (code == Errors.ERR_OK);
        this.isFail=!this.isSuccess
    }
    static newOk(data?: any): Errors {
        return new Errors(Errors.ERR_OK, 'success', data);
    }
    static newError(code: number, message?: string, data?: any): Errors {
        return new Errors(code, message, data);
    }
    static newNormalError(message?: string, data?: any): Errors {
        return new Errors(Errors.ERR_NORMAL, message, data);
    }
}
