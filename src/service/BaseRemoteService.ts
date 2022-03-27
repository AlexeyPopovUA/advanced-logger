import stringify from "fast-safe-stringify";

import IDefaultLogConfig from "../interface/config/IDefaultLogConfig";
import IRequestConfig from "../interface/config/IRequestConfig";
import IServiceConfig from "../interface/config/IServiceConfig";
import IDestructable from "../interface/IDestructable";
import IService from "../interface/IService";
import http from "../util/http";
import LogUtils from "../util/LogUtils";

export default class BaseRemoteService implements IService, IDestructable {
    protected serviceConfig: IRequestConfig;
    protected defaultLogConfig: IDefaultLogConfig;

    constructor(config: IServiceConfig) {
        this.serviceConfig = {...config.serviceConfig};
        this.defaultLogConfig = {...config.defaultLogConfig};

        // optional serializer override
        if (config.serializer) {
            this.serializer = config.serializer;
        }
    }

    public serializer<T>(log: T): string {
        return LogUtils.tryJSONStringify(log) || stringify(log);
    }

    public async sendAllLogs<T>(logs: T[]): Promise<Response> {
        const payload = await this.preparePayload(logs);
        const headers = this.getHeaders();

        try {
            return await http.request(this.serviceConfig, headers, payload);
        } catch (error) {
            if ((this.serviceConfig?.retryAttempts ?? 0) > 0) {
                return http.delayedRetry(
                    this.serviceConfig?.retryAttempts ?? 0,
                    this.serviceConfig?.retryInterval ?? 0,
                    http.request.bind(this, this.serviceConfig, headers, payload)
                );
            } else {
                throw error;
            }
        }
    }

    public async preparePayload<T>(logs: T[]): Promise<string> {
        const resultList = logs.map(log => this.serializer({...this.defaultLogConfig, ...log}));
        return resultList.join("\n");
    }

    public destroy(): void {
    };

    /**
     * Returns object for headers config
     * @example
     * {"Content-Type": "text/plain"}
     */
    protected getHeaders(): { [propName: string]: string } {
        return {};
    }
}
