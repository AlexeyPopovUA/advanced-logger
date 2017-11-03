import ServiceFacade from "../ServiceFacade";

export default interface IStrategyFacadeConfiguration {
    facade: ServiceFacade;
    strategyType: string;
    groupable?: boolean;
    interval?: number;
    bundleSize?: number;
}
