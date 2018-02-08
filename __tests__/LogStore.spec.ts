"use strict";

import "jest";
import LogStore from "../src/LogStore";

describe("LogStore", () => {
    let logStore: LogStore;

    afterEach(() => {
        if (logStore) {
            logStore.destroy();
            logStore = null;
        }
    });

    it("Should export LogStore", () => {
        expect(typeof LogStore).toBe("function");
    });

    it("Should be able to create a new LogStore instance", () => {
        expect(() => {
            logStore = new LogStore();
        }).not.toThrow();

        expect(logStore).toBeTruthy();
    });

    it("Should be able to emmit 'add' event when a new log is added", done => {
        logStore = new LogStore();

        logStore.eventEmitter.on("add", () => done());
        logStore.eventEmitter.on("error", err => done(err));

        logStore.add({test: "123"});
    });

    it("Should be able to emmit 'cleared' event when all logs are removed", done => {
        logStore = new LogStore();

        logStore.eventEmitter.on("clear", () => done());
        logStore.eventEmitter.on("error", err => done(err));

        logStore.clear();
    });
});
