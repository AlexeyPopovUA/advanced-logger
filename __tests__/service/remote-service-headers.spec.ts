import http from "../../src/util/http";
import LogglyService from "../../src/service/LogglyService";
import SumologicService from "../../src/service/SumologicService";
import IDefaultLogConfig from "../../src/interface/config/IDefaultLogConfig";
import IRequestConfig from "../../src/interface/config/IRequestConfig";
import IServiceConfig from "../../src/interface/config/IServiceConfig";

jest.mock("../../src/util/http");

describe("remote service request headers", () => {
    const defaultLogConfig: IDefaultLogConfig = {
        Domain: "logger-test-domain",
        BuildVersion: 123,
        Platform: "nodejs",
        Severity: "LogLevel.DEBUG",
        Data: "",
        Timestamp: "",
        Exception: "",
        Message: "",
        Category: "",
    };

    const testLogs = [{test: "test123"}, {test: "test321"}];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("sends Sumologic-specific headers on flush", async () => {
        const serviceConfig: IRequestConfig = {
            url: "https://www.example.com/logs",
            host: "advancedLoggerTest",
            sourceCategory: "AP/SB/oet/html5",
            sourceName: "name",
            method: "POST",
        };
        const config: IServiceConfig = {serviceConfig, defaultLogConfig};

        jest.mocked(http.request).mockImplementation((_conf, headers) => {
            expect(headers).toEqual({
                "Content-Type": "application/json",
                "X-Sumo-Category": "AP/SB/oet/html5",
                "X-Sumo-Host": "advancedLoggerTest",
                "X-Sumo-Name": "name",
            });
            return Promise.resolve({} as Response);
        });

        const service = new SumologicService(config);
        await service.sendAllLogs(testLogs);
        service.destroy();
    });

    it("sends Loggly plain-text content type on flush", async () => {
        const serviceConfig: IRequestConfig = {
            url: "https://www.example.com/logs",
            method: "POST",
        };
        const config: IServiceConfig = {serviceConfig, defaultLogConfig};

        jest.mocked(http.request).mockImplementation((_conf, headers) => {
            expect(headers).toEqual({"Content-Type": "text/plain"});
            return Promise.resolve({} as Response);
        });

        const service = new LogglyService(config);
        await service.sendAllLogs(testLogs);
        service.destroy();
    });
});
