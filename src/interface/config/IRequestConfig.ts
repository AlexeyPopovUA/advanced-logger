import {Method} from "axios";

export default interface IRequestConfig {
    url: string;
    method: Method;
    retryInterval?: number;
    retryAttempts?: number;
    //todo Refactor service configuration to be properly extendable
    logMetaIndexField?: string;

    [propName: string]: any;
}
