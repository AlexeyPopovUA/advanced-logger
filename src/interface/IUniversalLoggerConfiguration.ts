import {StrategyEnum} from "../enum/StrategyEnum";

export default interface IUniversalLoggerConfiguration {
    serviceType: string;
    serviceConfiguration?: any;
    strategyType: StrategyEnum;
    groupable?: boolean;
}
