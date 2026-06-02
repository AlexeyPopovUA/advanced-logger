import LogUtils from "../../src/util/LogUtils";

describe("LogUtils", () => {
    const log = {
        name: "logName",
        category: "logCat",
        test: "smth",
    };

    it("builds a stable id from the configured identity fields", () => {
        const keys = Object.keys(log).filter(key => key !== "test");

        const result = LogUtils.getLogIdByFields(log, keys);

        expect(result).toContain(log.name);
        expect(result).toContain(log.category);
        expect(result).not.toContain(log.test);
    });

    it("returns an empty string for circular structures", () => {
        const circular: {name: string; logData: unknown} = {
            name: "logName",
            logData: null,
        };
        circular.logData = circular;

        expect(LogUtils.tryJSONStringify(circular)).toBe("");
    });

    it("stringifies plain objects as JSON", () => {
        const plain = {
            name: "logName",
            category: "logCat",
            logData: {testData: 123},
        };

        const result = LogUtils.tryJSONStringify(plain);

        expect(result).toContain("testData");
        expect(result).toContain("category");
        expect(result).toContain("logName");
    });
});
