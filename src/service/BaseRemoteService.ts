import stringify from "fast-safe-stringify";
import IRequestConfig from "../interface/config/IRequestConfig";
import IServiceConfig from "../interface/config/IServiceConfig";
import IDestructable from "../interface/IDestructable";
import IService from "../interface/IService";
import http from "../util/http";
import LogUtils from "../util/LogUtils";

export default abstract class BaseRemoteService implements IService, IDestructable {
    protected serviceConfig: IRequestConfig;
    protected defaultLogConfig: any;

    protected constructor(config: IServiceConfig) {
        this.serviceConfig = config.serviceConfig;
        this.defaultLogConfig = config.defaultLogConfig || {};
    }

    public sendAllLogs<T>(logs: T[]): Promise<Response> {
        return this.preparePayload(logs)
            .then(payload => {
                const headers = this.getHeaders();

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

    public preparePayload<T>(logs: T[]): Promise<string> {
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

    /**
     * Returns object for headers config
     * @example
     * {"Content-Type": "text/plain"}
     */
    protected getHeaders(): any {
        return {};
    }
}
