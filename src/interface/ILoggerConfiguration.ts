import IService from "./IService";
import IStrategy from "./IStrategy";

export default interface ILoggerConfiguration {
    service: IService;
    strategy: IStrategy;
    groupable?: boolean;
}
