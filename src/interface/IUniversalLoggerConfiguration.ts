import IService from "./IService";
import IStrategy from "./IStrategy";

export default interface IUniversalLoggerConfiguration {
    service: IService;
    strategy: IStrategy;
    groupable?: boolean;
}
