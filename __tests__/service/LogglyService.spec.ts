"use strict";

import "jest";
import * as sinon from "sinon";
import LogglyService from "../../src/service/LogglyService";
import http from "./../../src/util/http";

// todo Rewrite stubs with jest functionality
const sandBox = sinon.createSandbox();

describe("LogglyService", () => {
    let service: LogglyService;
    const defaultLogConfig = {
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

    const serviceConfig = {
        url: "https://www.reuwyrtuwr.nl",
        method: "POST"
    };

    const config = {serviceConfig, defaultLogConfig};

    afterEach(() => {
        sandBox.restore();

        if (service) {
            service.destroy();
            service = null;
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

    it("Should fail with wrong/unreachable request", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        service = new LogglyService(config);
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

        service = new LogglyService(config);
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

        service = new LogglyService({
            serviceConfig: Object.assign({}, serviceConfig, {retryInterval: 10, retryAttempts}),
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

        service = new LogglyService({
            serviceConfig: Object.assign({}, serviceConfig, {retryInterval: 10, retryAttempts}),
            defaultLogConfig
        });

        const postRequestOld = http.postRequest;
        const mock = jest.fn(() => {
            http.postRequest = jest.fn(() => {
                http.postRequest = postRequestOld;
                return Promise.resolve({});
            });

            return Promise.reject("test reject");
        });
        http.postRequest = mock;

        service.sendAllLogs(testLogs)
            .then(() => {
                expect(mock).toHaveBeenCalledTimes(1);
                done();
            })
            .catch((error) => done(error));
    });
});
