import stringify from "fast-safe-stringify";
import IServiceConfig from "../interface/config/IServiceConfig";
import ISumologicRequestConfig from "../interface/config/ISumologicRequestConfig";
import ILog from "../interface/ILog";
import LogUtils from "../util/LogUtils";
import IService from "./../interface/IService";
import http from "./../util/http";

export default class SumologicService implements IService {
    private serviceConfig: ISumologicRequestConfig;
    private defaultLogConfig: any;

    constructor(config: IServiceConfig) {
        this.serviceConfig = config.serviceConfig as ISumologicRequestConfig;
        this.defaultLogConfig = config.defaultLogConfig || {};
    }

    // todo Is an additional config needed for initialization?
    // todo When should it be called?
    public initialize(config: any): Promise<any> {
        return Promise.resolve();
    }

    public sendAllLogs(logs: ILog[]): Promise<Response> {
        return this.preparePayload(logs)
            .then(payload => {
                const headers = {
                    "Content-Type": "application/json",
                    //todo Optional?
                    "X-Sumo-Category": this.serviceConfig.sourceCategory,
                    //todo Optional?
                    "X-Sumo-Host": this.serviceConfig.host,
                    //todo Optional?
                    "X-Sumo-Name": this.serviceConfig.sourceName
                };

                if (this.serviceConfig.retryAttempts && this.serviceConfig.retryAttempts > 0) {
                    return http.postRequest(this.serviceConfig, headers, payload)
                        .catch(() => http.delayedRetry(
                            this.serviceConfig.retryAttempts,
                            this.serviceConfig.retryInterval,
                            http.postRequest.bind(this, this.serviceConfig, headers, payload)
                        ));
                } else {
                    return http.postRequest(this.serviceConfig, headers, payload);
                }
            });
    }

    public preparePayload(logs: ILog[]): Promise<string> {
        const resultList = logs.map(log => {
            const preparedLog = Object.assign({}, this.defaultLogConfig, log);
            return LogUtils.tryJSONStringify(preparedLog) || stringify(preparedLog);
        });
        return Promise.resolve(resultList.join("\n"));
    }

    public destroy(): void {
        this.serviceConfig = null;
        this.defaultLogConfig = null;
    }
}
