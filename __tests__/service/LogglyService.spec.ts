"use strict";

import "jest";
import LogglyService from "../../src/service/LogglyService";
import http from "./../../src/util/http";

jest.mock("./../../src/util/http");

describe("LogglyService", () => {
    let service: LogglyService;
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

        (http.postRequest as jest.Mock).mockResolvedValue({});

        service = new LogglyService(config);
        service.sendAllLogs(testLogs)
            .then(() => done())
            .catch(() => done("should not fail"));
    });
});
