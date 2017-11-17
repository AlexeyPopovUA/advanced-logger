import IUniversalLoggerConfiguration from "./interface/IUniversalLoggerConfiguration";
import LogStore from "./LogStore";
import ServiceFacade from "./ServiceFacade";
import StrategyFacade from "./StrategyFacade";

/**
 * Uses different strategies to submit logs to log server via Service facade.
 */
export default class UniversalLogger {
    private configuration: IUniversalLoggerConfiguration;
    private facade: ServiceFacade;
    private strategy: StrategyFacade;
    private logStore: LogStore;

    constructor(configuration: IUniversalLoggerConfiguration) {
        this.configuration = configuration;

        this.facade = new ServiceFacade({
            serviceConfiguration: this.configuration.serviceConfiguration,
            serviceType: this.configuration.serviceType
        });

        // todo Replace with a new approach
        this.strategy = new StrategyFacade({
            // todo Review this dependency on facade
            facade: this.facade,
            strategyType: configuration.strategyType
        });

        this.logStore = new LogStore();
    }

    public initialize(): Promise<any> {
        // todo Review this dependency on facade
        return this.facade.initService(this.configuration.serviceConfiguration);
    }

    public reconfigure(config: any): void {
        // todo Do we need alternative service config here? (potentially, OET team logger case)
    }

    public log(log: any): void {
        this.logStore.add(log);
    }

    /**
     * Forces log sending for all strategyType types
     * @return {Promise<any>}
     */
    public sendAllLogs(): Promise<any> {
        // Todo subscribe to strategy event
        // send via strategyType to facade
        return this.strategy.sendAllLogs();
    }

    public destroy(): void {
        // todo Destroy all dependencies
    }
}
