import http from "../src/util/http";
import {wait} from "../src/util/TestUtils";
import { TransformationEnum } from "../src/enums/TransformationEnum";
import SumologicService from "../src/service/SumologicService";
import ConsoleService from "../src/service/ConsoleService";
import LogglyService from "../src/service/LogglyService";
import BaseRemoteService from "../src/service/BaseRemoteService";
import ElasticsearchService from "../src/service/ElasticsearchService";
import OnRequestStrategy from "../src/strategy/OnRequestStrategy";
import OnIntervalStrategy from "../src/strategy/OnIntervalStrategy";
import OnBundleSizeStrategy from "../src/strategy/OnBundleSizeStrategy";
import InstantStrategy from "../src/strategy/InstantStrategy";
import AdvancedLogger from "../src/AdvancedLogger";
import IDefaultLogConfig from "../src/interface/config/IDefaultLogConfig";
import IServiceConfig from "../src/interface/config/IServiceConfig";

jest.mock("../src/util/http");

describe("index", () => {
    let logger: AdvancedLogger<IDefaultLogConfig>;

    const config: IServiceConfig = {
        defaultLogConfig: {},
        serviceConfig: {
            sourceCategory: "",
            sourceName: "",
            host: "",
            url: "",
            method: "POST"
        }
    };

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();

        if (logger) {
            logger.destroy();
        }
    });

    it("Should export API", () => {
        expect(AdvancedLogger).toBeInstanceOf(Function);
        expect(InstantStrategy).toBeInstanceOf(Function);
        expect(OnBundleSizeStrategy).toBeInstanceOf(Function);
        expect(OnIntervalStrategy).toBeInstanceOf(Function);
        expect(OnRequestStrategy).toBeInstanceOf(Function);
        expect(SumologicService).toBeInstanceOf(Function);
        expect(ElasticsearchService).toBeInstanceOf(Function);
        expect(LogglyService).toBeInstanceOf(Function);
        expect(ConsoleService).toBeInstanceOf(Function);
        expect(BaseRemoteService).toBeInstanceOf(Function);
        expect(TransformationEnum).toBeInstanceOf(Object);
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

    it("Should deliver logs to the service", async () => {
        logger = new AdvancedLogger({
            service: new SumologicService(config),
            strategy: new OnRequestStrategy()
        });

        logger.log({test: "test123"});
        logger.log({test: "test321"});

        logger.sendAllLogs();

        await wait(10);

        expect(http.request).toHaveBeenCalledTimes(1);
        expect(http.request).toHaveBeenCalledWith(expect.anything(), expect.anything(),
            expect.stringMatching(/^.+test123.+[\n].+test321.+$/gi)
        );
    });

    it("Should not deliver anything to the service if there were no logs", async () => {
        logger = new AdvancedLogger({
            service: new SumologicService(config),
            strategy: new OnRequestStrategy()
        });

        logger.sendAllLogs();

        await wait(10);

        expect(http.request).toHaveBeenCalledTimes(0);
    });
});
