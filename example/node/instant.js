const {AdvancedLogger, service, strategy} = require('advanced-logger');

const defaultLogConfig = {
    Domain: "logger-test-domain",
    Channel: "my-company",
    BuildVersion: 123,
    Platform: "nodejs",
    Severity: "LogLevel.DEBUG",
    Data: "",
    Timestamp: "",
    Exception: "",
    Message: "",
    Category: "",
    ErrorId: 0
};

const serviceConfig = {
    //todo Replace with a real URL
    url: "https://www.google.nl",
    sourceName: "advancedLoggerTestNode",
    host: "advanced-logger",
    sourceCategory: "MY/SUMO/namespace",
    method: "POST"
};

const config = {serviceConfig, defaultLogConfig};

const logger = new AdvancedLogger({
    service: new service.SumologicService(config),
    strategy: new strategy.InstantStrategy()
});

logger.log({test: "instant log x"});
logger.log({test: "instant log xx"});
logger.log({test: "instant log xxx"});

logger.sendAllLogs();
