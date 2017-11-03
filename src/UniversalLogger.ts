import IUniversalLoggerConfiguration from "./interface/IUniversalLoggerConfiguration";
import ServiceFacade from "./ServiceFacade";
import StrategyFacade from "./StrategyFacade";

/**
 * Uses different strategies to submit logs to log server via Service facade.
 */
export default class UniversalLogger {
    private configuration: IUniversalLoggerConfiguration;
    private facade: ServiceFacade;
    private strategy: StrategyFacade;

    constructor(configuration: IUniversalLoggerConfiguration) {
        this.configuration = configuration;

        this.facade = new ServiceFacade({
            serviceConfiguration: this.configuration.serviceConfiguration,
            serviceType: this.configuration.serviceType
        });

        this.strategy = new StrategyFacade({
            // todo Review this dependency on facade
            facade: this.facade,
            strategyType: configuration.strategyType
        });
    }

    public initialize(): Promise<any> {
        // todo Review this dependency on facade
        return this.facade.initService(this.configuration.serviceConfiguration);
    }

    public reconfigure(config: any): void {
        // todo Do we need alternative service config here? (potentially, OET team logger case)
    }

    public log(log: any): void {
        this.strategy.log(log);
    }

    /**
     * Forces log sending for all strategyType types
     * @return {Promise<any>}
     */
    public sendAllLogs(): Promise<any> {
        // send via strategyType to facade
        return this.strategy.sendAllLogs();
    }

    public destroy(): void {
        // destroy all descendants
    }
}
