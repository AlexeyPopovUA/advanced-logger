"use strict";

import "jest";
import IRequestConfig from "../../src/interface/config/IRequestConfig";
import ElasticsearchService from "../../src/service/ElasticsearchService";
import http from "./../../src/util/http";

jest.mock("./../../src/util/http");

describe("ElasticsearchService", () => {
    let service: ElasticsearchService;
    const defaultLogConfig = {
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

    const serviceConfig = {
        url: "https://www.reuwyrtuwr.nl",
        method: "POST"
    };

    const config = {serviceConfig, defaultLogConfig};

    afterEach(() => {
        if (service) {
            service.destroy();
            service = null;
        }
    });

    it("Should export service", () => {
        expect(typeof ElasticsearchService).toBe("function");
    });

    it("Should be able to create a new service instance", () => {
        expect(() => {
            service = new ElasticsearchService(config);
        }).not.toThrow();

        expect(service).toBeTruthy();
    });

    it("Should not fail during logs sending step", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        (http.postRequest as jest.Mock).mockResolvedValue({});
        service = new ElasticsearchService(config);
        service.sendAllLogs(testLogs)
            .then(() => done())
            .catch(error => done(error));
    });

    it("Should send logs with correct headers", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        (http.postRequest as jest.Mock).mockResolvedValue({});
        service = new ElasticsearchService(config);
        service.sendAllLogs(testLogs)
            .then(() => done())
            .catch(error => done(error));
    });

    it("Should send logs in correct format", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        (http.postRequest as jest.Mock).mockImplementation((conf: IRequestConfig, headers: any, payload: string) => {
            expect(headers).toEqual({"Content-Type": "application/json"});
            expect(payload).toBeTruthy();
            //should always end with "\n"
            expect(payload.endsWith("\n")).toBe(true);
            // Separators amount =  N logs * (1 meta + 1 log)
            expect(payload.match(/\n/g).length).toBe(testLogs.length * 2);
            // 1 log -> 1 meta data
            expect(payload.match(/_index":"index"/g).length).toBe(testLogs.length);
        });

        service = new ElasticsearchService(config);
        service.sendAllLogs(testLogs)
            .then(() => done())
            .catch(error => done(error));
    });

    it("Should send logs with default meta", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test123", Index: "test-index"},
            {test: "test321"}
        ];

        (http.postRequest as jest.Mock).mockImplementation((conf: IRequestConfig, headers: any, payload: string) => {
            // 1 log -> 1 meta data
            expect(payload.match(/{"index":{"_index":"index","_type":"_doc"}}/g).length).toBe(2);
            expect(payload.match(/{"index":{"_index":"test-index","_type":"_doc"}}/g).length).toBe(1);
        });

        service = new ElasticsearchService(config);
        service.sendAllLogs(testLogs)
            .then(() => done())
            .catch(error => done(error));
    });

    it("Should send logs with custom meta configuration", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test321", Domain: "another-domain"},
            {test: "test321", Domain: ""}
        ];

        const config2 = {
            serviceConfig: {...serviceConfig, logMetaIndexField: "Domain"},
            defaultLogConfig: {Domain: "logger-test-domain"}
        };

        (http.postRequest as jest.Mock).mockImplementation((conf: IRequestConfig, headers: any, payload: string) => {
            expect(payload.match(/{"index":{"_index":"logger-test-domain","_type":"_doc"}}/g).length).toBe(1);
            expect(payload.match(/{"index":{"_index":"another-domain","_type":"_doc"}}/g).length).toBe(1);
            expect(payload.match(/{"index":{"_index":"index","_type":"_doc"}}/g).length).toBe(1);
        });

        service = new ElasticsearchService(config2);
        service.sendAllLogs(testLogs)
            .then(() => done())
            .catch(error => done(error));
    });
});
