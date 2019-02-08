"use strict";

import "jest";
import SumologicService from "../../src/service/SumologicService";

jest.mock("./../../src/util/http");

describe("SumologicService", () => {
    let service: SumologicService;
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
        host: "advancedLoggerTest",
        sourceCategory: "AP/SB/oet/html5",
        sourceName: "name",
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
        expect(typeof SumologicService).toBe("function");
    });

    it("Should be able to create a new service instance", () => {
        expect(() => {
            service = new SumologicService(config);
        }).not.toThrow();

        expect(service).toBeTruthy();
    });

    it("Should not fail during logs sending step", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        service = new SumologicService(config);
        service.sendAllLogs(testLogs)
            .then(() => done())
            .catch(() => done("should not fail"));
    });
});
