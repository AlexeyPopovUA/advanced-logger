import http from "../../src/util/http";
import IRequestConfig from "../../src/interface/config/IRequestConfig";
import ElasticsearchService from "../../src/service/ElasticsearchService";
import IDefaultLogConfig from "../../src/interface/config/IDefaultLogConfig";
import IServiceConfig from "../../src/interface/config/IServiceConfig";

jest.mock("../../src/util/http");

describe("ElasticsearchService", () => {
    let service: ElasticsearchService;

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

    const serviceConfig: IRequestConfig = {
        url: "https://www.example.com/logs",
        method: "POST",
    };

    const config: IServiceConfig = {serviceConfig, defaultLogConfig};

    afterEach(() => {
        service?.destroy();
    });

    it("sends logs when the remote call succeeds", async () => {
        jest.mocked(http.request).mockResolvedValue({} as Response);
        service = new ElasticsearchService(config);

        await expect(
            service.sendAllLogs([{test: "test123"}, {test: "test321"}])
        ).resolves.toBeDefined();
    });

    it("uses application/json content type and NDJSON bulk format", async () => {
        const testLogs = [{test: "test123"}, {test: "test321"}];

        jest.mocked(http.request).mockImplementation((_conf, headers, payload) => {
            expect(headers).toEqual({"Content-Type": "application/json"});
            expect(payload.endsWith("\n")).toBe(true);
            expect(payload.match(/\n/g)?.length).toBe(testLogs.length * 2);
            expect(payload.match(/"_index":"index"/g)?.length).toBe(testLogs.length);
            return Promise.resolve({} as Response);
        });

        service = new ElasticsearchService(config);
        await service.sendAllLogs(testLogs);
    });

    it("uses per-log index metadata when provided on the log", async () => {
        const testLogs = [
            {test: "test123"},
            {test: "test123", Index: "test-index"},
            {test: "test321"},
        ];

        jest.mocked(http.request).mockImplementation((_conf, _headers, payload) => {
            expect(payload.match(/{"index":{"_index":"index","_type":"_doc"}}/g)?.length).toBe(2);
            expect(payload.match(/{"index":{"_index":"test-index","_type":"_doc"}}/g)?.length).toBe(1);
            return Promise.resolve({} as Response);
        });

        service = new ElasticsearchService(config);
        await service.sendAllLogs(testLogs);
    });

    it("uses a configured field for index metadata with fallback to defaults", async () => {
        const testLogs = [
            {test: "test123"},
            {test: "test321", Domain: "another-domain"},
            {test: "test321", Domain: ""},
        ];

        const configWithMeta: IServiceConfig = {
            serviceConfig: {...serviceConfig, logMetaIndexField: "Domain"},
            defaultLogConfig: {Domain: "logger-test-domain"},
        };

        jest.mocked(http.request).mockImplementation((_conf, _headers, payload) => {
            expect(payload.match(/{"index":{"_index":"logger-test-domain","_type":"_doc"}}/g)?.length).toBe(1);
            expect(payload.match(/{"index":{"_index":"another-domain","_type":"_doc"}}/g)?.length).toBe(1);
            expect(payload.match(/{"index":{"_index":"index","_type":"_doc"}}/g)?.length).toBe(1);
            return Promise.resolve({} as Response);
        });

        service = new ElasticsearchService(configWithMeta);
        await service.sendAllLogs(testLogs);
    });
});
