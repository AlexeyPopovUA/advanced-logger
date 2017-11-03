import IService from "./../interface/IService";

export default class SumologicService implements IService {
    private config: any;

    constructor(config: any) {
        this.config = config;
    }

    public initialize(config: any): Promise<any> {
        // TODO Implement direct connection with API or SDK
        return Promise.resolve();
    }

    public sendAllLogs(logs: any[]): Promise<any> {
        // TODO Implement direct communication with API or SDK
        return Promise.resolve();
    }

    public preparePayload(logs: any[]): any {
        // TODO implement it (concatenate json strings with newline delimeter)
        return logs;
    }
}
