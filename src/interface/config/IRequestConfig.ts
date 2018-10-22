export default interface IRequestConfig {
    url: string;
    method: string;
    retryInterval?: number;
    retryAttempts?: number;
    [propName: string]: any;
}
