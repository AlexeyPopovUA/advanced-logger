"use strict";

import "jest";
import {StrategyEnum} from "../src/enum/StrategyEnum";
import Logger from "../src/index";

describe("index", () => {
    it("Should export Logger", () => {
        expect(typeof Logger).toBe("function");
    });

    it("Should be able to create a new Logger instance", () => {
        let logger;

        expect(() => {
            logger = new Logger({
                serviceConfiguration: {},
                serviceType: "SUMOLOGIC",
                strategy: StrategyEnum.ON_REQUEST
            });
        }).not.toThrow();

        expect(logger).toBeTruthy();
    });

    it("Should be able to init the Logger instance", (done) => {
        const logger = new Logger({
            serviceConfiguration: {},
            serviceType: "SUMOLOGIC",
            strategy: StrategyEnum.ON_REQUEST
        });

        logger.initialize()
            .then(() => done())
            .catch((e) => done(e));
    });
});
