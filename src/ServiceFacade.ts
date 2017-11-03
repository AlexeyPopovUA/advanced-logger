import IFacadeConfiguration from "./interface/IFacadeConfiguration";
import IService from "./interface/IService";
import SumologicService from "./service/SumologicService";

export default class ServiceFacade {
    private service: IService;
    private serviceType: string;
    private serviceConfiguration: any;
    private logs: any[];

    constructor(config: IFacadeConfiguration) {
        this.serviceType = config.serviceType;
        this.serviceConfiguration = config.serviceConfiguration;
    }

    public initService(config: any): Promise<any> {
        if (this.serviceType === "SUMOLOGIC") {
            this.service = new SumologicService(config);
        } else {
            throw new Error("Unsupported service");
        }

        return this.service.initialize(config);
    }

    public log(log: any) {
        this.logs.push(log);
    }

    public sendAllLogs(): Promise<any> {
        return this.service.sendAllLogs(this.service.preparePayload(this.logs));
    }
}
