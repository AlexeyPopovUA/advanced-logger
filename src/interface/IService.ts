export default interface IUniversalLoggerConfiguration {
    initialize(config: any): Promise<any>;

    sendAllLogs(logs: any[]): Promise<any>;

    preparePayload(logs: any[]): any;
}
