import IServiceConfig from "../interface/config/IServiceConfig";
import ISumologicRequestConfig from "../interface/config/ISumologicRequestConfig";
import BaseService from "./BaseService";

export default class SumologicService extends BaseService {
    constructor(config: IServiceConfig) {
        super(config);
    }

    protected getHeaders(): any {
        const serviceConfig = this.serviceConfig as ISumologicRequestConfig;
        return {
            "Content-Type": "application/json",
            //todo Optional?
            "X-Sumo-Category": serviceConfig.sourceCategory,
            //todo Optional?
            "X-Sumo-Host": serviceConfig.host,
            //todo Optional?
            "X-Sumo-Name": serviceConfig.sourceName
        };
    }
}
