import ILog from "../interface/ILog";
import IService from "./../interface/IService";
import postRequest from "./../util/http";

export default class SumologicService implements IService {
    private serviceConfig: {sourceCategory: string, host: string, url: string, method: string};
    private defaultLogConfig: any;

    constructor(config: {serviceConfig: any, defaultLogConfig: any}) {
        this.serviceConfig = config.serviceConfig;
        this.defaultLogConfig = config.defaultLogConfig;
    }

    public initialize(config: any): Promise<any> {
        return Promise.resolve();
    }

    public sendAllLogs(logs: ILog[]): Promise<any> {
        return this.preparePayload(logs)
            .then(payload => {
                //console.log("SumologicService#sendAllLogs -> ", logs);
                return postRequest(this.serviceConfig, payload);
            });
    }

    public preparePayload(logs: ILog[]): Promise<any> {
        const resultList = logs.map(log => JSON.stringify(Object.assign({}, this.defaultLogConfig, log)));
        const result = resultList.join("\n");

        return Promise.resolve(result);
    }

    public destroy(): void {
        this.serviceConfig = null;
        this.defaultLogConfig = null;
    }
}
