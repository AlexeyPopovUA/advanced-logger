import IServiceConfig from "../interface/config/IServiceConfig";
import BaseService from "./BaseService";

export default class LogglyService extends BaseService {
    constructor(config: IServiceConfig) {
        super(config);
    }

    protected getHeaders(): any {
        return {
            "Content-Type": "text/plain"
        };
    }
}
