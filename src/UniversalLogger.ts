import IUniversalLoggerConfiguration from "./interface/IUniversalLoggerConfiguration";

export default class UniversalLogger {
    constructor(configuration: IUniversalLoggerConfiguration) {
        //
    }

    public initialize(): Promise<any> {
        return Promise.resolve();
    }

    public reconfigure(): void {
        //
    }

    public log(): void {
        //
    }

    public sendAllLogs(): Promise<any> {
        return Promise.resolve();
    }

    public destroy(): void {
        //
    }
}
