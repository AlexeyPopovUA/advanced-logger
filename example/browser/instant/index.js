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
        url: "https://www.google.nl",
        sourceName: "advancedLoggerTest",
        host: "advanced-logger",
        sourceCategory: "MY/SUMO/namespace",
        method: "POST"
    };

    const config = {serviceConfig, defaultLogConfig};

    const logger = new AdvancedLogger({
        service: new service.SumologicService(config),
        strategy: new strategy.InstantStrategy()
    });

    document.querySelector("#run-test-button").addEventListener("click", () => {
        logger.log({test: "instant log u1"});
        logger.log({test: "instant log u2"});
        logger.log({test: "instant log u3"});
    });
});
