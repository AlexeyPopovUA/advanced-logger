import IRequestConfig from "./IRequestConfig";

export default interface IServiceConfig {
    serviceConfig: IRequestConfig;
    defaultLogConfig?: any;
    serializer?<T>(log: T): any;
}
