import Errors from "../errors/Errors";
/**
 * 客町不同平台的接口
 */
export default interface IKtPlatApi {
    /**
     * 账号登录
     * @param account 账号
     * @param password 密码
     * @param 返回的Promise中是Errors,data是AppSession
     */
    loginWithAccount(account: string, password: string): Promise<Errors>
    /**
     * 设置当前的sessionId
     */
    setupSessionId(sessionId: string): void;
    /**
     * 设置Endpoint
     */
    setupEndpoint(): void;
    /**
     * 获取VSC下仓库的名称
     */
    getVcsRepoName(): string;
    /**
     * 获取用户信息
     */
    getUserInfo():any;
    /**
     * 获取项目列表
     * @param page 页索引，从0开始
     * @param count 每页的数量
     * @param likeName 根据项目名称进行的模糊查询
     */
    getProjectList(page:number,count:number,likeName:string):Promise<Errors>;
    /**
     * 获取设备列表
     * @param projectId 项目ID
     */
    getDeviceList(projectId:string):Promise<Errors>;
}