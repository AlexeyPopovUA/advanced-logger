import IDestructable from "./IDestructable";

export default interface IUniversalLoggerConfiguration extends IDestructable {
    /**
     * Implement connection with API or SDK or prepare configurations
     */
    initialize(config: any): Promise<any>;

    /**
     * Implement direct communication with API or SDK
     */
    sendAllLogs(logs: any[]): Promise<any>;

    /**
     * Implement the final processing of logs before sending it directly to the endpoint
     */
    preparePayload(logs: any[]): Promise<any>;
}
