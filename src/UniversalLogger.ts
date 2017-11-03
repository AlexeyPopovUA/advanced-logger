import IUniversalLoggerConfiguration from "./interface/IUniversalLoggerConfiguration";
import ServiceFacade from "./ServiceFacade";

export default class UniversalLogger {
    private facade: ServiceFacade;
    private configuration: IUniversalLoggerConfiguration;

    constructor(configuration: IUniversalLoggerConfiguration) {
        this.configuration = configuration;

        // todo Check this.configuration.strategy value to determine the strategy

        this.facade = new ServiceFacade({
            serviceConfiguration: this.configuration.serviceConfiguration,
            serviceType: this.configuration.serviceType
        });
    }

    public initialize(): Promise<any> {
        return this.facade.initService(this.configuration.serviceConfiguration);
    }

    public reconfigure(config: any): void {
        // todo Do we need alternative service config here? (potentially, OET team logger case)
    }

    public log(log: any): void {
        // send via strategy to facade
    }

    public sendAllLogs(): Promise<any> {
        return Promise.resolve();
    }

    public destroy(): void {
        // destroy all descendants
    }
}
