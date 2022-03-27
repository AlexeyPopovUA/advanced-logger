import http from "../../src/util/http";
import {wait} from "../../src/util/TestUtils";
import AdvancedLogger from "../../src/AdvancedLogger";
import SumologicService from "../../src/service/SumologicService";
import OnBundleSizeStrategy from "../../src/strategy/OnBundleSizeStrategy";
import IDefaultLogConfig from "../../src/interface/config/IDefaultLogConfig";
import IServiceConfig from "../../src/interface/config/IServiceConfig";

jest.mock("../../src/util/http");

describe("OnBundleSizeStrategy", () => {
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

    it("Should deliver logs in bundles to the service", async () => {
        logger = new AdvancedLogger({
            service: new SumologicService(config),
            strategy: new OnBundleSizeStrategy({maxBundle: 5})
        });

        for (let i = 0; i < 5; i++) {
            logger.log({test: "test123"});
        }

        await wait(20);

        expect(http.request).toHaveBeenCalledTimes(1);
        expect(http.request).toHaveBeenCalledWith(expect.anything(), expect.anything(),
            expect.stringMatching(/^(.+test123.+[\n]?){5}$/gi)
        )
    });

    it("Should divide logs in bundles", async () => {
        logger = new AdvancedLogger({
            service: new SumologicService(config),
            strategy: new OnBundleSizeStrategy({maxBundle: 5})
        });

        for (let i = 0; i < 5; i++) { logger.log({test: "test123"}); }
        for (let i = 0; i < 5; i++) { logger.log({test: "test321"}); }

        await wait(20);

        expect(http.request).toHaveBeenCalledTimes(2);
        expect(http.request).toHaveBeenCalledWith(expect.anything(), expect.anything(),
            expect.stringMatching(/^(.+test123.+[\n]?){5}$/gi)
        );
        expect(http.request).toHaveBeenCalledWith(expect.anything(), expect.anything(),
            expect.stringMatching(/^(.+test321.+[\n]?){5}$/gi)
        );
    });
});
