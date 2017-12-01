"use strict";

import "jest";
import * as sinon from "sinon";
import {service} from "../src";
import {strategy} from "../src";
import {UniversalLogger} from "../src";

const SumologicService = service.SumologicService;
const OnRequestStrategy = strategy.OnRequestStrategy;

// todo Rewrite stubs with jest functionality
const sandBox = sinon.sandbox.create();

describe("index", () => {
    afterEach(() => {
        sandBox.restore();
    });

    it("Should export Logger", () => {
        expect(typeof UniversalLogger).toBe("function");
    });

    it("Should be able to create a new Logger instance", () => {
        let logger;

        expect(() => {
            logger = new UniversalLogger({
                service: new SumologicService({}),
                strategy: new OnRequestStrategy()
            });
        }).not.toThrow();

        expect(logger).toBeTruthy();
    });

    it("Should deliver logs to the service", done => {
        sandBox.stub(SumologicService.prototype, "sendAllLogs").callsFake(logs => {
            expect(logs.length).toBe(2);
            done();
        });

        const logger = new UniversalLogger({
            service: new SumologicService({}),
            strategy: new OnRequestStrategy()
        });

        logger.log({test: "test123"});
        logger.log({test: "test321"});

        logger.sendAllLogs();
    });
});
