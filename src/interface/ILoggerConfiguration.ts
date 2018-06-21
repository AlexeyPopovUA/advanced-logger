import IService from "./IService";
import IStrategy from "./IStrategy";

export default interface ILoggerConfiguration {
    service: IService;
    strategy: IStrategy;
    //todo Add support for groupable logs
    groupable?: boolean;
}
