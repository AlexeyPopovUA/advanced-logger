import LogglyService from "../../src/service/LogglyService";
import http from "./../../src/util/http";
import IDefaultLogConfig from "../../src/interface/config/IDefaultLogConfig";
import IRequestConfig from "../../src/interface/config/IRequestConfig";
import IServiceConfig from "../../src/interface/config/IServiceConfig";

jest.mock("./../../src/util/http");

describe("LogglyService", () => {
    let service: LogglyService;
    const defaultLogConfig: IDefaultLogConfig = {
        Domain: "logger-test-domain",
        BuildVersion: 123,
        Platform: "nodejs",
        Severity: "LogLevel.DEBUG",
        Data: "",
        Timestamp: "",
        Exception: "",
        Message: "",
        Category: ""
    };

    const serviceConfig: IRequestConfig = {
        url: "https://www.reuwyrtuwr.nl",
        method: "POST"
    };

    const config: IServiceConfig = {serviceConfig, defaultLogConfig};

    afterEach(() => {
        if (service) {
            service.destroy();
        }
    });

    it("Should export service", () => {
        expect(typeof LogglyService).toBe("function");
    });

    it("Should be able to create a new service instance", () => {
        expect(() => {
            service = new LogglyService(config);
        }).not.toThrow();

        expect(service).toBeTruthy();
    });

    it("Should not fail during logs sending step", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        (http.request as jest.Mock).mockResolvedValue({});

        service = new LogglyService(config);
        service.sendAllLogs(testLogs)
            .then(() => done())
            .catch(() => done("should not fail"));
    });
});
