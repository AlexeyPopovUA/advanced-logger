/**
 * @jest-environment jsdom
 */

import fs from "node:fs";

import {assertBundlesExist, BROWSER_BUNDLE} from "./bundlePaths";
import {
    assertPublicApi,
    BuiltLoggerApi,
    exerciseConsoleOnRequestFlush,
    exerciseSumologicFlush,
} from "./scenarios";

declare global {
    interface Window {
        advancedLogger: BuiltLoggerApi;
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

describe("Browser runtime (IIFE bundle)", () => {
    let api: BuiltLoggerApi;

    beforeAll(() => {
        assertBundlesExist();
        loadBrowserBundle();
        api = window.advancedLogger;
    });

    beforeEach(() => {
        globalThis.fetch = jest.fn();
    });

    it("exposes advancedLogger on window", () => {
        expect(window.advancedLogger).toBeDefined();
        assertPublicApi(api);
    });

    it("flushes logs with ConsoleService without error", async () => {
        await exerciseConsoleOnRequestFlush(api);
    });

    it("flushes logs to a remote service via fetch", async () => {
        await exerciseSumologicFlush(api);
    });
});
