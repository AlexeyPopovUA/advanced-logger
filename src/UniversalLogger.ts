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
            error: this.onAddError.bind(this),
            next: this.onAddSuccess.bind(this)
        });

        this.logStore.clearObservable.subscribe({
            error: this.onClearError.bind(this),
            next: this.onClearSuccess.bind(this)
        });

        this.strategy.sendObservable.subscribe({
            error: this.onSendError.bind(this),
            next: this.onSendSuccess.bind(this)
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
        this.logStore.destroy();
        this.logStore = null;
        this.strategy.destroy();
        this.strategy = null;
        this.service.destroy();
        this.service = null;
        this.configuration = null;
    }

    private onAddError(error: Error): void {
        console.error(error);
    }

    private onAddSuccess(info: any) {
        this.strategy.onAdd(info);
    }

    private onClearError(error: Error): void {
        console.error(error);
    }

    private onClearSuccess(info: any) {
        this.strategy.onClear();
    }

    private onSendError(error: Error): void {
        console.error(error);
    }

    // todo Review methods naming
    private onSendSuccess(): void {
        const logs = this.logStore.getAll();

        this.service.sendAllLogs(logs)
            // todo What happens if new logs arrive before the old ones are successfully sent?
            // Do we need temporary sending buffer?
            .then(() => this.logStore.clear())
            .catch(error => {
                console.log(error);
                // todo Retry sending logs here or in the strategy
            });
    }
}
