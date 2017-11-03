import IService from "./IService";

export default interface IUniversalLoggerConfiguration {
    strategy: string;

    groupable?: boolean;

    loggingService: IService;
}
