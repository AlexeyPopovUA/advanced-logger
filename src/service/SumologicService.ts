import IRemoteServiceConfig from "../interface/config/IRemoteServiceConfig";
import ISumologicServiceConfig from "../interface/config/ISumologicServiceConfig";
import ILog from "../interface/ILog";
import IService from "./../interface/IService";
import postRequest from "./../util/http";

export default class SumologicService implements IService {
    private serviceConfig: IRemoteServiceConfig;
    private defaultLogConfig: any;

    constructor(config: ISumologicServiceConfig) {
        this.serviceConfig = config.serviceConfig;
        this.defaultLogConfig = config.defaultLogConfig || {};
    }

    // todo Do we need an additional config for initialization?
    public initialize(config: any): Promise<any> {
        return Promise.resolve();
    }

    public sendAllLogs(logs: ILog[]): Promise<any> {
        return this.preparePayload(logs)
            .then(payload => {
                if (this.serviceConfig.retryAttempts && this.serviceConfig.retryAttempts > 0) {
                    return this.retry(this.serviceConfig.retryAttempts, this.serviceConfig.retryInterval,
                        postRequest.bind(this, this.serviceConfig, payload));
                } else {
                    return postRequest(this.serviceConfig, payload);
                }
            });
    }

    public preparePayload(logs: ILog[]): Promise<any> {
        const resultList = logs.map(log => JSON.stringify(Object.assign({}, this.defaultLogConfig, log)));
        return Promise.resolve(resultList.join("\n"));
    }

    public destroy(): void {
        this.serviceConfig = null;
        this.defaultLogConfig = null;
    }

    private retry(retries: number, delay = 0, fn: () => Promise<any>): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            setTimeout(() => fn().then(resolve).catch(reject), delay);
        })
        .catch(error => retries > 1 ? this.retry(retries - 1, delay, fn) : Promise.reject(error));
    }
}
