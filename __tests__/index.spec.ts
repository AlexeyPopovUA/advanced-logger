"use strict";

import "jest";
import {service} from "../src";
import {strategy} from "../src";
import {UniversalLogger} from "../src";

const SumologicService = service.SumologicService;
const OnRequestStrategy = strategy.OnRequestStrategy;

describe("index", () => {
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
});
