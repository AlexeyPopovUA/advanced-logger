"use strict";

import "jest";
import LogUtils from "../../src/util/LogUtils";

describe("LogUtils", () => {
    const log = {
        name: "logName",
        category: "logCat",
        test: "smth"
    };

    it("getLogIdByFields should return id by fields", () => {
        const keys = Object.keys(log);
        keys.splice(keys.indexOf("test"), 1);

        const result = LogUtils.getLogIdByFields(log, keys);
        expect(result).toContain(log.name);
        expect(result).toContain(log.category);
        expect(result).not.toContain(log.test);
    });

    it("tryJSONStringify should return empty result for circularly nested object", () => {
        const logCirc = {
            name: "logName",
            category: "logCat",
            test: "smth"
        };

        Object.assign(logCirc, {logData: logCirc});

        const result = LogUtils.tryJSONStringify(logCirc);
        expect(result).toEqual("");
    });

    it("tryJSONStringify should return stringified json for a plain object", () => {
        const logPlain = {
            name: "logName",
            category: "logCat",
            test: "smth",
            logData: {
                testData: 123
            }
        };

        const result = LogUtils.tryJSONStringify(logPlain);
        expect(result).toBeTruthy();
        expect(result).toContain("testData");
        expect(result).toContain("category");
        expect(result).toContain("logName");
    });
});
