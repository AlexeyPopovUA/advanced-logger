export default interface IRemoteServiceConfig {
    sourceCategory: string;
    host: string;
    url: string;
    method: string;
    retryInterval?: number;
    retryAttempts?: number;
}
