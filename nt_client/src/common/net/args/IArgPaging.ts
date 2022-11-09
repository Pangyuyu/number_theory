/**
 * 分页查询所需字段
 */
export default interface IArgPaging {
    page: number;
    pageSize: number;
    orderBy: string;
    order: string;
}
