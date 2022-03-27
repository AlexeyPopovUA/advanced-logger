import IService from "../interface/IService";

/**
 * Console reporting service for debugging purposes
 */
export default class ConsoleService implements IService {
    public async preparePayload<T>(logs: T[]): Promise<T[]> {
        return logs.map(log => this.serializer(log));
    }

    public async sendAllLogs<T>(logs: T[]): Promise<void> {
        console.log(logs);
    }

    public destroy(): void {
        //nothing to do here
    }

    public serializer<T>(log: T): T {
        return log;
    }
}
