import BaseRemoteService from "../../src/service/BaseRemoteService";
import http from "./../../src/util/http";
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
        CloneInGroupCounter: 1
    };

    const serviceConfig: IRequestConfig = {
        url: "https://www.reuwyrtuwr.nl",
        host: "advancedLoggerTest",
        sourceCategory: "AP/SB/oet/html5",
        sourceName: "name",
        method: "POST"
    };

    const config: IServiceConfig = {serviceConfig, defaultLogConfig};

    afterEach(() => {
        if (service) {
            service.destroy();
        }
    });

    it("Should export service", () => {
        expect(typeof BaseRemoteService).toBe("function");
    });

    it("Should be able to create a new service instance", () => {
        expect(() => {
            service = new BaseRemoteService(config);
        }).not.toThrow();

        expect(service).toBeTruthy();
    });

    it("Should fail with wrong/unreachable request", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        service = new BaseRemoteService(config);
        service.sendAllLogs(testLogs)
            .then(() => done("should fail"))
            .catch(() => done());
    });

    it("Should safely prepare logs for request", done => {
        const log = {test: "444", circle: {}};
        //circular link in order to create problems for serializer
        log.circle = log;
        const testLogs = [
            {test: "test123"},
            log,
            {test: "test321"}
        ];

        service = new BaseRemoteService(config);
        service
            .preparePayload(testLogs)
            .then(payload => {
                expect(typeof payload).toBe("string");
                expect(payload).toContain("[Circular]");
                done();
            })
            .catch(error => done(error));
    });

    it("Should retry failed requests", done => {
        const retryAttempts = 3;
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        service = new BaseRemoteService({
            serviceConfig: {...serviceConfig, retryInterval: 10, retryAttempts},
            defaultLogConfig
        });

        const spy = jest.spyOn(http, "delayedRetry");

        service.sendAllLogs(testLogs)
            .then(() => done("should fail"))
            .catch(() => {
                expect(spy).toHaveBeenCalledTimes(retryAttempts);
                spy.mockRestore();
                done();
            });
    });

    it("Should send logs to the endpoint after retry", done => {
        const retryAttempts = 5;
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        service = new BaseRemoteService({
            serviceConfig: {...serviceConfig, retryInterval: 10, retryAttempts},
            defaultLogConfig
        });

        const postRequestOld = http.request;
        const mock = jest.fn(() => {
            http.request = jest.fn(() => {
                http.request = postRequestOld;
                return Promise.resolve(({}) as Response);
            });

            return Promise.reject("test reject");
        });
        http.request = mock;

        service.sendAllLogs(testLogs)
            .then(() => {
                expect(mock).toHaveBeenCalledTimes(1);
                done();
            })
            .catch((error) => done(error));
    });
});
