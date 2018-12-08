"use strict";

import "jest";
import ConsoleService from "../../src/service/ConsoleService";

describe("ConsoleService", () => {
    let service: ConsoleService;

    afterEach(() => {
        if (service) {
            service.destroy();
            service = null;
        }
    });

    it("Should export service", () => {
        expect(typeof ConsoleService).toBe("function");
    });

    it("Should be able to create a new service instance", () => {
        expect(() => {
            service = new ConsoleService();
        }).not.toThrow();

        expect(service).toBeTruthy();
    });

    it("Should not fail with request", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        service = new ConsoleService();
        service.sendAllLogs(testLogs)
            .then(() => done())
            .catch(() => done("should not fail"));
    });

    it("Should prepare logs for request", async () => {
        const log = {test: "444", circle: {}};
        //circular link in order to create problems for serializer
        log.circle = log;
        const testLogs = [
            {test: "test123"},
            log,
            {test: "test321"}
        ];

        service = new ConsoleService();
        await service
            .preparePayload(testLogs)
            .then(payload => {
                expect(payload instanceof Array).toBe(true);
                expect(payload.length).toBe(3);
                expect(payload[2].test).toBe("test321");
            });
    });
});
