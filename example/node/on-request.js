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
    strategy: new strategy.OnRequestStrategy()
});

logger.log({test: "node test log1"});
logger.log({test: "node test log2"});

logger.sendAllLogs();
