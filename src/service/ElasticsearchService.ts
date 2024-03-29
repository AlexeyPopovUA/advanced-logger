import ILogMetaConfig from "../interface/config/ILogMetaConfig";
import BaseRemoteService from "./BaseRemoteService";

const DEFAULT_INDEX_FIELD = "Index";
const DEFAULT_INDEX_VALUE = "index";

export default class ElasticsearchService extends BaseRemoteService {
    public async preparePayload<T>(logs: T[]): Promise<string> {
        const resultList: string[] = [];
        logs.forEach(log => {
            const finalLog = {...this.defaultLogConfig, ...log};
            resultList.push(this.serializer(this.getLogMetaConfig(
                finalLog[this.serviceConfig.logMetaIndexField || DEFAULT_INDEX_FIELD])));
            resultList.push(this.serializer(finalLog));
        });

        return `${resultList.join("\n")}\n`;
    }

    protected getHeaders(): {[propName: string]: string} {
        return {
            "Content-Type": "application/json"
        };
    }

    private getLogMetaConfig(index?: string): ILogMetaConfig {
        return {
            index: {
                _index: index || DEFAULT_INDEX_VALUE,
                _type: "_doc"
            }
        };
    }
}
