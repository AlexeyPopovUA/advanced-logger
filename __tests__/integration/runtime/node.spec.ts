import {assertBundlesExist, NODE_BUNDLE} from "./bundlePaths";
import {
    assertPublicApi,
    BuiltLoggerApi,
    exerciseConsoleOnRequestFlush,
    exerciseSumologicFlush,
} from "./scenarios";

describe("Node runtime (built bundle)", () => {
    let api: BuiltLoggerApi;

    beforeAll(() => {
        assertBundlesExist();
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        api = require(NODE_BUNDLE) as BuiltLoggerApi;
    });

    beforeEach(() => {
        globalThis.fetch = jest.fn();
    });

    it("exposes the public API from the package entry", () => {
        assertPublicApi(api);
    });

    it("flushes logs with ConsoleService without error", async () => {
        await exerciseConsoleOnRequestFlush(api);
    });

    it("flushes logs to a remote service via fetch", async () => {
        await exerciseSumologicFlush(api);
    });
});
