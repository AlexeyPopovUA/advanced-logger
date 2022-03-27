import http from "../../src/util/http";
import {wait} from "../../src/util/TestUtils";
import AdvancedLogger from "../../src/AdvancedLogger";
import SumologicService from "../../src/service/SumologicService";
import InstantStrategy from "../../src/strategy/InstantStrategy";
import IDefaultLogConfig from "../../src/interface/config/IDefaultLogConfig";
import IServiceConfig from "../../src/interface/config/IServiceConfig";

jest.mock("../../src/util/http");

describe("InstantStrategy", () => {
    let logger: AdvancedLogger<IDefaultLogConfig>

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

    it("Should deliver logs instantly to the service", async () => {
        logger = new AdvancedLogger({
            service: new SumologicService(config),
            strategy: new InstantStrategy()
        });

        logger.log({test: "test123"});

        await wait(20);

        expect(http.request).toHaveBeenCalledWith(expect.anything(), expect.anything(),
            expect.stringContaining("test123")
        )
    });
});
