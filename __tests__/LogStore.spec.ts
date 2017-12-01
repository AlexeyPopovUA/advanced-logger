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

        logStore.addObservable.subscribe({
            error: err => done(err),
            next: () => done()
        });

        logStore.add({test: "123"});
    });

    // todo Use 'scan' in order to test multiple event firing

    it("Should be able to emmit 'cleared' event when all logs are removed", done => {
        logStore = new LogStore();

        logStore.clearObservable.subscribe({
            error: err => done(err),
            next: () => done()
        });

        logStore.clear();
    });

    // todo Use 'scan' in order to test multiple event firing
});
