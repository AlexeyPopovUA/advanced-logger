import IStrategy from "./interface/IStrategy";
import IUniversalLoggerConfiguration from "./interface/IUniversalLoggerConfiguration";
import LogStore from "./LogStore";
import ServiceFacade from "./ServiceFacade";
import OnRequestStrategy from "./strategy/OnRequestStrategy";

/**
 * Uses different strategies to submit logs to log server via Service facade.
 */
export default class UniversalLogger {
    private configuration: IUniversalLoggerConfiguration;
    private facade: ServiceFacade;
    private strategy: IStrategy;
    private logStore: LogStore;

    constructor(configuration: IUniversalLoggerConfiguration) {
        this.configuration = configuration;

        this.facade = new ServiceFacade({
            serviceConfiguration: this.configuration.serviceConfiguration,
            serviceType: this.configuration.serviceType
        });

        this.logStore = new LogStore();
        this.strategy = new OnRequestStrategy();

        // todo Where is it better to subscribe?
        this.logStore.addObservable.subscribe({
            error: error => console.error(error),
            next: () => this.strategy.onAdd({ count: this.logStore.size()})
        });

        this.strategy.sendObservable.subscribe({
            error: error => console.error(error),
            next: () => this.facade.sendAllLogs()
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
        this.logStore.add(log);
    }

    /**
     * Forces log sending for all strategyType types
     */
    public sendAllLogs(): void {
        this.strategy.sendAll();
    }

    public destroy(): void {
        // todo Destroy all dependencies
    }
}
