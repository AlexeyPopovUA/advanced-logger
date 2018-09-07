"use strict";

import "jest";
import * as sinon from "sinon";
import {AdvancedLogger} from "../../src";
import {service} from "../../src";
import {strategy} from "../../src";

const SumologicService = service.SumologicService;
const InstantStrategy = strategy.InstantStrategy;

// todo Rewrite stubs with jest functionality
const sandBox = sinon.createSandbox();

describe("InstantStrategy", () => {
    let logger: AdvancedLogger;

    const config = {
        defaultLogConfig: {},
        serviceConfig: {
            sourceCategory: "",
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

    it("Should deliver logs instantly to the service", done => {
        logger = new AdvancedLogger({
            service: new SumologicService(config),
            strategy: new InstantStrategy()
        });

        sandBox.stub(SumologicService.prototype, "sendAllLogs").callsFake(logs => {
            expect(logs.length).toBe(1);
            done();
            return Promise.resolve();
        });

        logger.log({test: "test123"});
    });
});
