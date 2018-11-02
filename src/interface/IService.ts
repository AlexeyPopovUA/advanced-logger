import IDestructable from "./IDestructable";

export default interface IService extends IDestructable {
    /**
     * Implement direct communication with API or SDK
     */
    sendAllLogs<T>(logs: T[]): Promise<any>;

    /**
     * Implement the final processing of logs before sending it directly to the endpoint
     */
    preparePayload<T>(logs: T[]): Promise<any>;
}
