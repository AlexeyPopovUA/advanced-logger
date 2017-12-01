import IService from "./../interface/IService";

export default class SumologicService implements IService {
    private config: any;

    constructor(config: any) {
        this.config = config;

        // TODO Review these Sumologic configs and adopt them to the service
        // default connection config
        /*"endpoint": config.url,
        "sessionKey": config.sessionKey*/

        // default task config
        /*
        {
            "Domain": document.domain,
            "UserAgent": navigator.userAgent,
            "Channel": "albelli",
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
        // TODO Implement direct connection with API or SDK
        return Promise.resolve();
    }

    public sendAllLogs(logs: any[]): Promise<any> {
        // TODO Implement direct communication with API or SDK
        return Promise.resolve();
    }

    public preparePayload(logs: any[]): any {
        // TODO implement it (concatenate json strings with newline delimeter)
        return Promise.resolve(logs);
    }

    public destroy(): void {
        this.config = null;
    }
}
