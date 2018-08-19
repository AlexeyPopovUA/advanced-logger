import IService from "./../interface/IService";
import postRequest from "./../util/http";

export default class SumologicService implements IService {
    private serviceConfig: {sourceCategory: string, host: string, url: string, method: string};
    private defaultLogConfig: any;

    constructor(config: {serviceConfig: any, defaultLogConfig: any}) {
        this.serviceConfig = config.serviceConfig;
        this.defaultLogConfig = config.defaultLogConfig;

        // TODO Review these Sumologic configs and adopt them to the service
        // default connection config
        /*"endpoint": config.url,
        "sessionKey": config.sessionKey*/

        // default task config
        /*
        {
            "Domain": document.domain,
            "UserAgent": navigator.userAgent,
            "Channel": "my-company",
            "BuildVersion": window["environment"] ? window["environment"]["build"] : 0,
            "Platform": utils.getCurrentPlatform(),
            "Article": "",
            "StoredProductId": null,
            "Severity": LogLevel.DEBUG,
            "Data": "",
            "Timestamp": "",
            "Exception": "",
            "Message": "",
            "Category": "",
            "ErrorId": 0,
            "CloneInGroupCounter": 1
        }
        */

        // custom task config
        /*
        {
            "Severity": data["level"],
            "Data": data["data"],
            "Message": data["message"],
            "Category": data["category"],
            "Exception": data["exception"],
            "Timestamp": new Date().toISOString()
        }
        */
    }

    public initialize(config: any): Promise<any> {
        return Promise.resolve();
    }

    public sendAllLogs(logs: any[]): Promise<any> {
        return this.preparePayload(logs)
            .then(payload => {
                console.log("SumologicService#sendAllLogs -> ", logs);
                return postRequest(this.serviceConfig, payload);
            });
    }

    public preparePayload(logs: any[]): Promise<any> {
        const resultList = logs.map(log => JSON.stringify(Object.assign({}, this.defaultLogConfig, log)));
        const result = resultList.join("\n");

        return Promise.resolve(result);
    }

    public destroy(): void {
        this.serviceConfig = null;
        this.defaultLogConfig = null;
    }
}
