import ISumologicRequestConfig from "../interface/config/ISumologicRequestConfig";
import BaseRemoteService from "./BaseRemoteService";

export default class SumologicService extends BaseRemoteService {
    protected getHeaders(): {[propName: string]: string} {
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
