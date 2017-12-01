import IService from "./interface/IService";
import IStrategy from "./interface/IStrategy";
import IUniversalLoggerConfiguration from "./interface/IUniversalLoggerConfiguration";
import LogStore from "./LogStore";

/**
 * Uses different strategies to submit logs to log server via Service facade.
 */
export default class UniversalLogger {
    private configuration: IUniversalLoggerConfiguration;
    private strategy: IStrategy;
    private service: IService;
    private logStore: LogStore;

    constructor(configuration: IUniversalLoggerConfiguration) {
        this.configuration = configuration;
        this.logStore = new LogStore();
        this.strategy = this.configuration.strategy;
        this.service = this.configuration.service;

        // todo Where is it better to subscribe?
        this.logStore.addObservable.subscribe({
            error: error => console.error(error),
            next: info => this.strategy.onAdd(info)
        });

        this.strategy.sendObservable.subscribe({
            error: error => console.error(error),
            next: () => {
                const logs = this.logStore.getAll();

                this.service
                    .sendAllLogs(this.service.preparePayload(logs))
                    // todo What happens if new logs arrive before the old ones are successfully sent?
                    // Do we need temporary sending buffer?
                    .then(() => this.logStore.clear())
                    .catch(error => {
                        console.log(error);
                        // todo Retry sending logs
                    });
            }
        });
    }

    public log(log: any): void {
        this.logStore.add(log);
    }

    /**
     * Forces strategy to initiate logs sending
     */
    public sendAllLogs(): void {
        this.strategy.sendAll();
    }

    public destroy(): void {
        // todo Destroy all dependencies
    }
}
