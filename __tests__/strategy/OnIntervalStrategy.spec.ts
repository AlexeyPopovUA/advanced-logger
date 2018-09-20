"use strict";

import "jest";
import * as sinon from "sinon";
import {AdvancedLogger} from "../../src";
import {service} from "../../src";
import {strategy} from "../../src";

const SumologicService = service.SumologicService;
const OnIntervalStrategy = strategy.OnIntervalStrategy;

// todo Rewrite stubs with jest functionality
const sandBox = sinon.createSandbox();

describe("OnIntervalStrategy", () => {
    let logger: AdvancedLogger;

    const config = {
        defaultLogConfig: {},
        serviceConfig: {
            sourceCategory: "",
            sourceName: "",
            host: "",
            url: "",
            method: ""
        }
    };

    afterEach(() => {
        sandBox.restore();

        if (logger) {
            logger.destroy();
            logger = null;
        }
    });

    it("Should deliver logs in bundles to the service after timeout", done => {
        logger = new AdvancedLogger({
            service: new SumologicService(config),
            strategy: new OnIntervalStrategy({interval: 50})
        });

        sandBox.stub(SumologicService.prototype, "sendAllLogs").callsFake(logs => {
            expect(logs.length).toBe(6);
            done();
            return Promise.resolve();
        });

        logger.log({test: "test123"});

        setTimeout(() => {
            for (let i = 0; i < 5; i++) { logger.log({test: "test321"}); }
        }, 10);
    });
});
