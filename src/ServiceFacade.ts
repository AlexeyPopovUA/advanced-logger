import IFacadeConfiguration from "./interface/IFacadeConfiguration";
import IService from "./interface/IService";
import SumologicService from "./service/SumologicService";

export default class ServiceFacade {
    private service: IService;
    private serviceType: string;
    private serviceConfiguration: any;

    constructor(config: IFacadeConfiguration) {
        this.serviceType = config.serviceType;
        this.serviceConfiguration = config.serviceConfiguration;
    }

    public initService(config: any): Promise<any> {
        if (this.serviceType === "SUMOLOGIC") {
            this.service = new SumologicService(config);
        }

        return this.service.initialize(config);
    }

    public sendAll(logs: any[]): Promise<any> {
        return this.service.sendAllLogs(logs);
    }
}
