export type Method =
    | "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH"
    | "get" | "delete" | "head" | "options" | "post" | "put" | "patch";

export default interface IRequestConfig {
    url: string;
    method: Method;
    retryInterval?: number;
    retryAttempts?: number;
    //todo Refactor service configuration to be properly extendable
    logMetaIndexField?: string;

    [propName: string]: any;
}
