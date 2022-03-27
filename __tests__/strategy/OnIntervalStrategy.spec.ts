import http from "../../src/util/http";
import {wait} from "../../src/util/TestUtils";
import AdvancedLogger from "../../src/AdvancedLogger";
import SumologicService from "../../src/service/SumologicService";
import OnIntervalStrategy from "../../src/strategy/OnIntervalStrategy";
import IDefaultLogConfig from "../../src/interface/config/IDefaultLogConfig";
import IServiceConfig from "../../src/interface/config/IServiceConfig";

jest.mock("../../src/util/http");

describe("OnIntervalStrategy", () => {
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

    it("Should deliver logs in bundles to the service after timeout", async () => {
        logger = new AdvancedLogger({
            service: new SumologicService(config),
            strategy: new OnIntervalStrategy({interval: 50})
        });

        logger.log({test: "test123"});

        setTimeout(() => {
            for (let i = 0; i < 5; i++) { logger.log({test: "test321"}); }
        }, 10);

        await wait(60);

        expect(http.request).toHaveBeenCalledTimes(1);
        expect(http.request).toHaveBeenCalledWith(expect.anything(), expect.anything(),
            expect.stringMatching(/^.+test123.+\n(.+test321.+[\n]?){5}$/gi)
        );
    });
});
