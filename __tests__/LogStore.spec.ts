"use strict";

import "jest";
import {TransformationEnum} from "../src";
import LogStore from "../src/LogStore";

describe("LogStore", () => {
    let logStore;

    const emptyStoreConfig = {
        transformations: []
    };
    const storeConfigWithGrouping = {
        transformations: [{
            type: TransformationEnum.RAPID_FIRE_GROUPING,
            configuration: {
                interval: 10,
                groupIdentityFields: ["test"],
                groupFieldName: "CloneInGroupCounter"
            }
        }]
    };

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
            logStore = new LogStore(emptyStoreConfig);
        }).not.toThrow();

        expect(logStore).toBeTruthy();
    });

    it("Should be able to emmit 'add' event when a new log is added", done => {
        logStore = new LogStore(emptyStoreConfig);

        logStore.eventEmitter.on("add", () => done());
        logStore.eventEmitter.on("error", err => done(err));

        logStore.add({test: "123"});
    });

    it("Should be able to emmit 'cleared' event when all logs are removed", done => {
        logStore = new LogStore(emptyStoreConfig);

        logStore.eventEmitter.on("clear", () => done());
        logStore.eventEmitter.on("error", err => done(err));

        logStore.clear();
    });

    it("Should return logs with grouping of duplications", done => {
        logStore = new LogStore(storeConfigWithGrouping);

        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "321"});

        setTimeout(() => {
            const logs = logStore.getAll();
            expect(logs.length).toEqual(2);
            expect(logs.find(item => item["test"] === "123")["CloneInGroupCounter"]).toBe(2);
            done();
        }, 20);
    });

    it("Should return logs with multiple grouping iterations", done => {
        logStore = new LogStore(storeConfigWithGrouping);

        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "321"});

        setTimeout(() => {
            logStore.add({test: "123"});
            logStore.add({test: "123"});
            logStore.add({test: "123"});
            logStore.add({test: "321"});

            setTimeout(() => {
                const nextLogs = logStore.getAll();
                expect(nextLogs.length).toEqual(4);
                done();
            }, 20);
        }, 20);
    });

    it("Should finalize grouping when logs are needed", () => {
        logStore = new LogStore(storeConfigWithGrouping);

        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "321"});

        let logs = logStore.getAll();

        expect(logs.length).toEqual(2);
        expect(logs.find(item => item["test"] === "123")["CloneInGroupCounter"]).toBe(2);

        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "321"});

        logs = logStore.getAll();

        expect(logs.length).toEqual(4);
    });
});
