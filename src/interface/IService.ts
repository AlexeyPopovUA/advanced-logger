import IDestructable from "./IDestructable";

export default interface IUniversalLoggerConfiguration extends IDestructable {
    initialize(config: any): Promise<any>;

    sendAllLogs(logs: any[]): Promise<any>;

    preparePayload(logs: any[]): Promise<any>;
}
