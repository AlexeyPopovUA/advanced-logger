import stringify from "fast-safe-stringify";
import IRequestConfig from "../interface/config/IRequestConfig";
import IServiceConfig from "../interface/config/IServiceConfig";
import ILog from "../interface/ILog";
import LogUtils from "../util/LogUtils";
import IService from "./../interface/IService";
import http from "./../util/http";

export default class LogglyService implements IService {
    private serviceConfig: IRequestConfig;
    private defaultLogConfig: any;

    constructor(config: IServiceConfig) {
        this.serviceConfig = config.serviceConfig;
        this.defaultLogConfig = config.defaultLogConfig || {};
    }

    public initialize(config: any): Promise<any> {
        return Promise.resolve();
    }

    public sendAllLogs(logs: ILog[]): Promise<Response> {
        return this.preparePayload(logs)
            .then(payload => {
                const headers = {
                    "Content-Type": "text/plain"
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
