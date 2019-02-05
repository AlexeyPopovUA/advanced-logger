export default interface IRequestConfig {
    url: string;
    method: string;
    retryInterval?: number;
    retryAttempts?: number;
    //todo Refactor service configuration to be properly extendable
    logMetaIndexField?: string;
    [propName: string]: any;
}
