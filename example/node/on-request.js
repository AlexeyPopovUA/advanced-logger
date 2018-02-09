const {UniversalLogger, service, strategy} = require('./../../dist/index');

const defaultLogConfig = {
    Domain: "logger-test-domain",
    UserAgent: "userAgent",
    Channel: "albelli",
    BuildVersion: 123,
    Platform: "browser",
    Article: "article",
    StoredProductId: "productId",
    Severity: "LogLevel.DEBUG",
    Data: "",
    Timestamp: "",
    Exception: "",
    Message: "",
    Category: "",
    ErrorId: 0,
    CloneInGroupCounter: 1
};

const serviceConfig = {
    //todo Replace with a real URL
    url: "https://www.google.nl",
    sourceName: "universalLoggerTestNode",
    host: "universal-logger",
    sourceCategory: "AP/SB/oet/html5"
};

const config = {serviceConfig, defaultLogConfig};

const logger = new UniversalLogger({
    service: new service.SumologicService(config),
    strategy: new strategy.OnRequestStrategy()
});

logger.log({test: "node test log1"});
logger.log({test: "node test log2"});

logger.sendAllLogs();
