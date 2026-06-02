import BaseRemoteService from "../../src/service/BaseRemoteService";
import http from "../../src/util/http";

jest.mock("../../src/util/http", () => {
    const actual = jest.requireActual<typeof import("../../src/util/http")>("../../src/util/http");
    return {
        __esModule: true,
        default: {
            ...actual.default,
            request: jest.fn(),
        },
    };
});
import IServiceConfig from "../../src/interface/config/IServiceConfig";
import IRequestConfig from "../../src/interface/config/IRequestConfig";
import IDefaultLogConfig from "../../src/interface/config/IDefaultLogConfig";

describe("BaseRemoteService", () => {
    let service: BaseRemoteService;

    const defaultLogConfig: IDefaultLogConfig = {
        Domain: "logger-test-domain",
        UserAgent: "userAgent",
        Channel: "my-company",
        BuildVersion: 123,
        Platform: "nodejs",
        Article: "article",
        StoredProductId: "productId",
        Severity: "LogLevel.DEBUG",
        Data: "",
        Timestamp: "",
        Exception: "",
        Message: "",
        Category: "",
        ErrorId: 0,
        CloneInGroupCounter: 1,
    };

    const serviceConfig: IRequestConfig = {
        url: "https://www.example.com/logs",
        host: "advancedLoggerTest",
        sourceCategory: "AP/SB/oet/html5",
        sourceName: "name",
        method: "POST",
    };

    const config: IServiceConfig = {serviceConfig, defaultLogConfig};

    afterEach(() => {
        service?.destroy();
    });

    it("rejects when the remote endpoint is unreachable", async () => {
        jest.mocked(http.request).mockRejectedValue(new Error("network error"));
        service = new BaseRemoteService(config);

        await expect(
            service.sendAllLogs([{test: "test123"}, {test: "test321"}])
        ).rejects.toThrow("network error");
    });

    it("serializes circular references safely in the payload", async () => {
        service = new BaseRemoteService(config);
        const circular: {test: string; circle: unknown} = {test: "444", circle: {}};
        circular.circle = circular;

        const payload = await service.preparePayload([
            {test: "test123"},
            circular,
            {test: "test321"},
        ]);

        expect(typeof payload).toBe("string");
        expect(payload).toContain("[Circular]");
    });

    it("delegates to delayedRetry when the initial request fails and retries are configured", async () => {
        const retryAttempts = 3;
        jest.mocked(http.request).mockRejectedValue(new Error("network error"));
        service = new BaseRemoteService({
            serviceConfig: {...serviceConfig, retryInterval: 10, retryAttempts},
            defaultLogConfig,
        });

        const spy = jest.spyOn(http, "delayedRetry");

        await expect(
            service.sendAllLogs([{test: "test123"}, {test: "test321"}])
        ).rejects.toThrow("network error");

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe(retryAttempts);
    });

    it("succeeds after a failed first request when retry is configured", async () => {
        service = new BaseRemoteService({
            serviceConfig: {...serviceConfig, retryInterval: 10, retryAttempts: 5},
            defaultLogConfig,
        });

        jest.mocked(http.request)
            .mockRejectedValueOnce(new Error("temporary failure"))
            .mockResolvedValue({} as Response);

        await service.sendAllLogs([{test: "test123"}, {test: "test321"}]);

        expect(jest.mocked(http.request).mock.calls.length).toBeGreaterThanOrEqual(2);
    });
});
