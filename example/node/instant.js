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
    strategy: new strategy.InstantStrategy()
});

logger.log({test: "instant log x"});
logger.log({test: "instant log xx"});
logger.log({test: "instant log xxx"});

logger.sendAllLogs();
