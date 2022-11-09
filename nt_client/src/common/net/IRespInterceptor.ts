import KtRequest from './KtRequest';
import KtResponse from './KtResponse';
/**
 * 拦截器
 */
export default interface IRespInterceptor {
    (req: KtRequest, response: KtResponse): void;
}
