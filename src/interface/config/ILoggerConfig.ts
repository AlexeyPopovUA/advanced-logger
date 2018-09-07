import IService from "../IService";
import IStrategy from "../IStrategy";
import ITransformation from "../ITransformation";

export default interface ILoggerConfig {
    service: IService;
    strategy: IStrategy;
    transformations?: ITransformation[];
}
