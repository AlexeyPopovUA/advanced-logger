"use strict";

import "jest";
import * as sinon from "sinon";
import {AdvancedLogger} from "../../src";
import {service} from "../../src";
import {strategy} from "../../src";

const SumologicService = service.SumologicService;
const OnBundleSizeStrategy = strategy.OnBundleSizeStrategy;

// todo Rewrite stubs with jest functionality
const sandBox = sinon.createSandbox();

describe("OnBundleSizeStrategy", () => {
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

    it("Should deliver logs in bundles to the service", done => {
        logger = new AdvancedLogger({
            service: new SumologicService(config),
            strategy: new OnBundleSizeStrategy({maxBundle: 5})
        });

        sandBox.stub(SumologicService.prototype, "sendAllLogs").callsFake(logs => {
            expect(logs.length).toBe(5);
            done();
            return Promise.resolve();
        });

        for (let i = 0; i < 5; i++) { logger.log({test: "test123"}); }
    });

    it("Should divide logs in bundles", done => {
        logger = new AdvancedLogger({
            service: new SumologicService(config),
            strategy: new OnBundleSizeStrategy({maxBundle: 5})
        });

        const stub = sandBox.stub(SumologicService.prototype, "sendAllLogs").callsFake(logs => {
            expect(logs.length).toBe(5);
            expect(logs[0].test === "test123").toBe(true);

            stub.restore();
            sandBox.stub(SumologicService.prototype, "sendAllLogs").callsFake(logs => {
                expect(logs.length).toBe(5);
                expect(logs[0].test === "test321").toBe(true);
                done();
                return Promise.resolve();
            });
            return Promise.resolve();
        });

        for (let i = 0; i < 5; i++) { logger.log({test: "test123"}); }
        for (let i = 0; i < 5; i++) { logger.log({test: "test321"}); }
    });
});
