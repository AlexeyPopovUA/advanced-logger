import IStrategy from "../interface/IStrategy";
import IStrategyConfig from "../interface/IStrategyConfig";
import ServiceFacade from "../ServiceFacade";

export default class OnRequestStrategy implements IStrategy {
    public facade: ServiceFacade;

    private config: IStrategyConfig;

    constructor(config: IStrategyConfig) {
        this.config = config;
    }

    public log(log: any): void {
        this.facade.log(log);
    }

    public sendAllLogs(): Promise<any> {
        return this.facade.sendAllLogs();
    }
}
