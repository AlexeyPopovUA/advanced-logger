export default interface ISumologicRequestConfig {
    sourceCategory: string;
    host: string;
    url: string;
    sourceName: string;
    method: string;
    retryInterval?: number;
    retryAttempts?: number;
}
