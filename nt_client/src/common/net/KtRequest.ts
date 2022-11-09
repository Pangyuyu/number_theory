export default class KtRequest {
    url: string = '';
    method: string = 'GET';
    dataType: string = '';
    data: any = {};
    timeout: number = 10 * 1000;
    headers: any = {};
    onUploadProgress:any;
    // processData:boolean= false;
    withUrl(url: string): KtRequest {
        this.url = url;
        return this;
    }
    withMethod(method: string): KtRequest {
        this.method = method;
        return this;
    }
    withDataType(dataType: string): KtRequest {
        this.dataType = dataType;
        return this;
    }
    withData(data: any): KtRequest {
        this.data = data;
        return this;
    }
    withTimeout(timeout: number): KtRequest {
        this.timeout = timeout;
        return this;
    }
    withHeader(headers: any): KtRequest {
        this.headers = headers;
        return this;
    }
}
