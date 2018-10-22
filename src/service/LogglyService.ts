import IServiceConfig from "../interface/config/IServiceConfig";
import BaseRemoteService from "./BaseRemoteService";

export default class LogglyService extends BaseRemoteService {
    constructor(config: IServiceConfig) {
        super(config);
    }

    protected getHeaders(): any {
        return {
            "Content-Type": "text/plain"
        };
    }
}
