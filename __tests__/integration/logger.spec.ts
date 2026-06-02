import http from "../../src/util/http";
import {
    AdvancedLogger,
    service,
    strategy,
    TransformationEnum,
} from "../../src/index";
import InstantStrategy from "../../src/strategy/InstantStrategy";
import OnBundleSizeStrategy from "../../src/strategy/OnBundleSizeStrategy";
import OnIntervalStrategy from "../../src/strategy/OnIntervalStrategy";
import OnRequestStrategy from "../../src/strategy/OnRequestStrategy";
import IDefaultLogConfig from "../../src/interface/config/IDefaultLogConfig";
import {createLogger} from "../helpers/fixtures";
import {flushLogger, wait} from "../helpers/flush";

jest.mock("../../src/util/http");

describe("AdvancedLogger integration", () => {
    let logger: AdvancedLogger<IDefaultLogConfig>;

    afterEach(() => {
        jest.clearAllTimers();
        logger?.destroy();
    });

    it("exposes the public API from the package entry", () => {
        expect(AdvancedLogger).toBeDefined();
        expect(strategy.InstantStrategy).toBeDefined();
        expect(strategy.OnBundleSizeStrategy).toBeDefined();
        expect(strategy.OnIntervalStrategy).toBeDefined();
        expect(strategy.OnRequestStrategy).toBeDefined();
        expect(service.SumologicService).toBeDefined();
        expect(service.ElasticsearchService).toBeDefined();
        expect(service.LogglyService).toBeDefined();
        expect(service.ConsoleService).toBeDefined();
        expect(service.BaseRemoteService).toBeDefined();
        expect(TransformationEnum.RAPID_FIRE_GROUPING).toBeDefined();
    });

    it("flushes buffered logs when sendAllLogs is called", async () => {
        logger = createLogger({strategy: new OnRequestStrategy()});

        logger.log({test: "test123"});
        logger.log({test: "test321"});

        await flushLogger(logger);

        expect(jest.mocked(http.request)).toHaveBeenCalledTimes(1);
        const payload = jest.mocked(http.request).mock.calls[0][2];
        expect(payload).toContain("test123");
        expect(payload).toContain("test321");
    });

    it("does not call the remote service when there are no logs to flush", async () => {
        logger = createLogger({strategy: new OnRequestStrategy()});

        await flushLogger(logger);

        expect(jest.mocked(http.request)).not.toHaveBeenCalled();
    });

    it("sends each log immediately with the instant strategy", async () => {
        logger = createLogger({strategy: new InstantStrategy()});

        logger.log({test: "first"});
        await wait(10);
        logger.log({test: "second"});
        await wait(10);

        expect(jest.mocked(http.request)).toHaveBeenCalledTimes(2);
        expect(jest.mocked(http.request).mock.calls[0][2]).toContain("first");
        expect(jest.mocked(http.request).mock.calls[1][2]).toContain("second");
    });

    it("batches logs within the interval window", async () => {
        logger = createLogger({strategy: new OnIntervalStrategy({interval: 50})});

        logger.log({test: "test123"});

        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                logger.log({test: "test321"});
            }
        }, 10);

        await wait(60);

        expect(jest.mocked(http.request)).toHaveBeenCalledTimes(1);
        const payload = jest.mocked(http.request).mock.calls[0][2];
        expect(payload).toContain("test123");
        expect(payload.match(/test321/g)?.length).toBe(5);
    });

    it("flushes when the bundle size threshold is reached", async () => {
        logger = createLogger({strategy: new OnBundleSizeStrategy({maxBundle: 5})});

        for (let i = 0; i < 5; i++) {
            logger.log({test: "test123"});
        }

        await wait(20);

        expect(jest.mocked(http.request)).toHaveBeenCalledTimes(1);
        expect(jest.mocked(http.request).mock.calls[0][2]).toContain("test123");
    });

    it("splits logs into multiple bundles when exceeding max bundle size", async () => {
        logger = createLogger({strategy: new OnBundleSizeStrategy({maxBundle: 5})});

        for (let i = 0; i < 5; i++) {
            logger.log({test: "test123"});
        }
        for (let i = 0; i < 5; i++) {
            logger.log({test: "test321"});
        }

        await wait(20);

        expect(jest.mocked(http.request)).toHaveBeenCalledTimes(2);
        expect(jest.mocked(http.request).mock.calls[0][2]).toContain("test123");
        expect(jest.mocked(http.request).mock.calls[1][2]).toContain("test321");
    });
});
