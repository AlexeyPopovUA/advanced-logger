"use strict";

import "jest";
import * as sinon from "sinon";
import {service, TransformationEnum} from "../src";
import {strategy} from "../src";
import {AdvancedLogger} from "../src";

const SumologicService = service.SumologicService;
const OnRequestStrategy = strategy.OnRequestStrategy;

// todo Rewrite stubs with jest functionality
const sandBox = sinon.createSandbox();

describe("index", () => {
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

    it("Should export API", () => {
        expect(typeof AdvancedLogger).toBe("function");
        expect(typeof strategy.InstantStrategy).toBe("function");
        expect(typeof strategy.OnBundleSizeStrategy).toBe("function");
        expect(typeof strategy.OnIntervalStrategy).toBe("function");
        expect(typeof strategy.OnRequestStrategy).toBe("function");
        expect(typeof service.SumologicService).toBe("function");
        expect(typeof service.LogglyService).toBe("function");
        expect(typeof service.ConsoleService).toBe("function");
        expect(typeof TransformationEnum).toBe("object");
        expect(typeof TransformationEnum.RAPID_FIRE_GROUPING).toBe("number");
    });

    it("Should be able to create a new Logger instance", () => {
        expect(() => {
            logger = new AdvancedLogger({
                service: new SumologicService(config),
                strategy: new OnRequestStrategy()
            });
        }).not.toThrow();

        expect(logger).toBeTruthy();
    });

    it("Should deliver logs to the service", done => {
        sandBox.stub(SumologicService.prototype, "sendAllLogs").callsFake(logs => {
            expect(logs.length).toBe(2);
            done();
            return Promise.reject("This is a deliberate error throwing");
        });

        logger = new AdvancedLogger({
            service: new SumologicService(config),
            strategy: new OnRequestStrategy()
        });

        logger.log({test: "test123"});
        logger.log({test: "test321"});

        logger.sendAllLogs();
    });
});
