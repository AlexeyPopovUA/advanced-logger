import IService from "./../interface/IService";

export default class SumologicService implements IService {
    private config: any;

    constructor(config: any) {
        this.config = config;
    }

    public initialize(config: any): Promise<any> {
        // implement direct connection with API or SDK
        return Promise.resolve();
    }

    public sendAllLogs(logs: any[]): Promise<any> {
        // implement direct communication with API or SDK
        return Promise.resolve();
    }
}
