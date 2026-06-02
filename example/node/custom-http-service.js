const {AdvancedLogger, service, strategy} = require('advanced-logger');

const defaultLogConfig = {
    BuildVersion: 123,
    Platform: "nodejs",
    Severity: "LogLevel.DEBUG",
    Data: "",
    Timestamp: "",
    Exception: "",
    Message: "",
    Category: ""
};

const serviceConfig = {
    //todo Replace with a real URL
    url: "https://www.google.nl",
    method: "POST"
};

const config = {serviceConfig, defaultLogConfig};

class CustomHttpService extends service.BaseRemoteService {
    /**
     * @override
     * @param config
     * @returns {CustomHttpService}
     */
    constructor(config) {
        console.log("constructor", config);
        return super(config);
    }

    /**
     * @override
     * @param logs
     * @returns {Promise<string>}
     */
    preparePayload(logs) {
        const resultList = logs.map(log => ({...this.defaultLogConfig, ...log}));
        console.log("preparePayload", resultList);
        return Promise.resolve(this.serializer(resultList));
    }
}

const logger = new AdvancedLogger({
    service: new CustomHttpService(config),
    strategy: new strategy.OnRequestStrategy()
});

logger.log({test: "node test log1"});
logger.log({Message: "node test log2 message"});

logger.sendAllLogs();
