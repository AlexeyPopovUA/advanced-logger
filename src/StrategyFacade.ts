import {StrategyEnum} from "./enum/StrategyEnum";
import IStrategy from "./interface/IStrategy";
import IStrategyFacadeConfiguration from "./interface/IStrategyFacadeConfiguration";
import ServiceFacade from "./ServiceFacade";
import OnRequestStrategy from "./strategy/OnRequestStrategy";

export default class StrategyFacade {
    private strategy: IStrategy;
    private facade: ServiceFacade;
    private strategyConfiguration: IStrategyFacadeConfiguration;

    constructor(config: IStrategyFacadeConfiguration) {
        this.strategyConfiguration = config;
        this.facade = this.strategyConfiguration.facade;

        if (this.strategyConfiguration.strategyType === StrategyEnum.ON_REQUEST) {
            this.strategy = new OnRequestStrategy({
                facade: this.facade
            });
        } else {
            throw new Error("Unsupported strategyType");
        }
    }

    public log(log: any): void {
        this.strategy.log(log);
    }

    public sendAllLogs(): Promise<any> {
        return this.strategy.sendAllLogs();
    }
}
