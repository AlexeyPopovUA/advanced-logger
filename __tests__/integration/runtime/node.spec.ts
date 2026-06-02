jest.mock("axios", () => ({
    __esModule: true,
    default: {
        request: jest.fn().mockResolvedValue({}),
    },
}));

import {assertBundlesExist} from "./bundlePaths";
import {
    assertPublicApi,
    BuiltLoggerApi,
    exerciseConsoleOnRequestFlush,
    exerciseSumologicFlushWithAxios,
} from "./scenarios";

describe("Node runtime (built bundle)", () => {
    let api: BuiltLoggerApi;

    beforeAll(() => {
        assertBundlesExist();
        process.env.NODE_ENV = "development";
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        api = require("../../../main-node.js").advancedLogger as BuiltLoggerApi;
    });

    it("exposes the public API from the package entry", () => {
        assertPublicApi(api);
    });

    it("flushes logs with ConsoleService without error", async () => {
        await exerciseConsoleOnRequestFlush(api);
    });

    it("flushes logs to Sumologic via axios", async () => {
        await exerciseSumologicFlushWithAxios(api);
    });
});
