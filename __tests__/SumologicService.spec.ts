"use strict";

import "jest";
import * as sinon from "sinon";
import SumologicService from "../src/service/SumologicService";

// todo Rewrite stubs with jest functionality
const sandBox = sinon.sandbox.create();

describe("SumologicService", () => {
    let service: SumologicService;
    const defaultLogConfig = {
        Domain: "logger-test-domain",
        UserAgent: "userAgent",
        Channel: "albelli",
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
        url: "https://www.google.nl",
        host: "universalLoggerTest",
        sourceCategory: "AP/SB/oet/html5"
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
        expect(typeof SumologicService).toBe("function");
    });

    it("Should be able to create a new service instance", () => {
        expect(() => {
            service = new SumologicService(config);
        }).not.toThrow();

        expect(service).toBeTruthy();
    });

    it.skip("Should send logs to the endpoint", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        service = new SumologicService(config);
        service.sendAllLogs(testLogs)
            .then(() => done())
            .catch(error => done(error));
    });
});
