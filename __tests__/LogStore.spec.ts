"use strict";

import "jest";
import LogStore from "../src/LogStore";

describe("LogStore", () => {
    it("Should export LogStore", () => {
        expect(typeof LogStore).toBe("function");
    });

    it("Should be able to create a new LogStore instance", () => {
        let logStore;

        expect(() => {
            logStore = new LogStore();
        }).not.toThrow();

        expect(logStore).toBeTruthy();
    });

    it("Should be able to emmit 'add' event when a new log is added", done => {
        const logStore = new LogStore();

        logStore.addObservable.subscribe({
            complete: () => done("Should not complete"),
            error: err => done(err),
            next: () => done()
        });

        logStore.add({test: "123"});
    });

    // todo Use 'scan' in order to test multiple event firing

    it("Should be able to emmit 'cleared' event when all logs are removed", done => {
        const logStore = new LogStore();

        logStore.clearObservable.subscribe({
            complete: () => done("Should not complete"),
            error: err => done(err),
            next: () => done()
        });

        logStore.clear();
    });

    // todo Use 'scan' in order to test multiple event firing
});
