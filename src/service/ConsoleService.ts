import ILog from "../interface/ILog";
import IService from "../interface/IService";

/**
 * Console reporting service for debugging purposes
 */
export default class ConsoleService implements IService {
    public preparePayload(logs: ILog[]): Promise<any> {
        return Promise.resolve(logs);
    }

    public sendAllLogs(logs: ILog[]): Promise<any> {
        console.log(logs);
        return Promise.resolve();
    }

    public destroy(): void {
        //nothing to do here
    }
}
