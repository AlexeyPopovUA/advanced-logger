window.addEventListener("load", () => {
    console.log(window.advancedLogger);

    const {AdvancedLogger, service, strategy} = window.advancedLogger;

    const defaultLogConfig = {
        Domain: "logger-test-domain",
        UserAgent: window.userAgent,
        Channel: "my-company",
        BuildVersion: 123,
        Platform: "browser",
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
        url: "https://logs-01.loggly.com/bulk/<customertoken>/tag/bulk/",
        method: "POST"
    };

    const config = {serviceConfig, defaultLogConfig};

    const logger = new AdvancedLogger({
        service: new service.LogglyService(config),
        strategy: new strategy.OnRequestStrategy()
    });

    logger.log({test: "test123"});
    logger.log({test: "test321"});

    document.querySelector("#run-test-button").addEventListener("click", () => logger.sendAllLogs());
});
