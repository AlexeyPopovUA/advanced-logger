/**
 * @jest-environment jsdom
 */

jest.mock("axios", () => ({
    __esModule: true,
    default: {
        request: jest.fn().mockResolvedValue({}),
    },
}));

import fs from "node:fs";
import axios from "axios";

import {assertBundlesExist, BROWSER_BUNDLE} from "./bundlePaths";
import {
    assertPublicApi,
    BuiltLoggerApi,
    exerciseConsoleOnRequestFlush,
    exerciseSumologicFlushWithAxios,
} from "./scenarios";

declare global {
    interface Window {
        advancedLogger: BuiltLoggerApi;
        axios: typeof axios;
    }
}

function loadBrowserBundle(): void {
    const script = document.createElement("script");
    script.textContent = fs.readFileSync(BROWSER_BUNDLE, "utf8");
    document.head.appendChild(script);

    if (!window.advancedLogger) {
        throw new Error(`window.advancedLogger not set after loading: ${BROWSER_BUNDLE}`);
    }
}

describe("Browser runtime (UMD bundle)", () => {
    let api: BuiltLoggerApi;

    beforeAll(() => {
        assertBundlesExist();
        window.axios = axios;
        loadBrowserBundle();
        api = window.advancedLogger;
    });

    it("exposes advancedLogger on window", () => {
        expect(window.advancedLogger).toBeDefined();
        assertPublicApi(api);
    });

    it("flushes logs with ConsoleService without error", async () => {
        await exerciseConsoleOnRequestFlush(api);
    });

    it("flushes logs to Sumologic via axios", async () => {
        await exerciseSumologicFlushWithAxios(api);
    });
});
