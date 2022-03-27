import IDefaultLogConfig from "./IDefaultLogConfig";
import IRequestConfig from "./IRequestConfig";

export default interface IServiceConfig {
    serviceConfig: IRequestConfig;
    defaultLogConfig?: IDefaultLogConfig;
    serializer?<T extends IDefaultLogConfig>(log: T): string;
}
