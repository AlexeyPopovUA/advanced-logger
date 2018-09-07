import IRemoteServiceConfig from "./IRemoteServiceConfig";

export default interface ISumologicServiceConfig {
    serviceConfig: IRemoteServiceConfig;
    defaultLogConfig?: any;
}
