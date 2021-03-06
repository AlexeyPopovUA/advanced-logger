import IService from "../interface/IService";

/**
 * Console reporting service for debugging purposes
 */
export default class ConsoleService implements IService {
    public preparePayload<T>(logs: T[]): Promise<T[]> {
        return Promise.resolve(logs.map(log => this.serializer(log)));
    }

    public sendAllLogs<T>(logs: T[]): Promise<void> {
        console.log(logs);
        return Promise.resolve();
    }

    public destroy(): void {
        //nothing to do here
    }

    public serializer<T>(log: T): T {
        return log;
    }
}
