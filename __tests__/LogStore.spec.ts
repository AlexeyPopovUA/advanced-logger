import {TransformationEnum} from "../src/enums/TransformationEnum";
import LogStore from "../src/LogStore";
import IDefaultLogConfig from "../src/interface/config/IDefaultLogConfig";
import ILogStoreConfig from "../src/interface/config/ILogStoreConfig";
import {onceEvent} from "./helpers/events";
import {wait} from "./helpers/flush";

describe("LogStore", () => {
    let logStore: LogStore<IDefaultLogConfig & {test: string}>;

    const emptyStoreConfig: ILogStoreConfig = {
        transformations: [],
    };
    const storeConfigWithGrouping: ILogStoreConfig = {
        transformations: [{
            type: TransformationEnum.RAPID_FIRE_GROUPING,
            configuration: {
                interval: 10,
                groupIdentityFields: ["test"],
                groupFieldName: "CloneInGroupCounter",
            },
        }],
    };

    afterEach(() => {
        jest.clearAllTimers();
        logStore?.destroy();
    });

    it("emits add when a log is stored", async () => {
        logStore = new LogStore(emptyStoreConfig);

        const addPromise = onceEvent(logStore.eventEmitter, "add");
        logStore.add({test: "123"});

        await expect(addPromise).resolves.toEqual({logCount: 1});
    });

    it("emits clear when the store is emptied", async () => {
        logStore = new LogStore(emptyStoreConfig);

        const clearPromise = onceEvent(logStore.eventEmitter, "clear");
        logStore.clear();

        await expect(clearPromise).resolves.toBeUndefined();
    });

    it("groups duplicate logs by identity fields after the grouping interval", async () => {
        logStore = new LogStore(storeConfigWithGrouping);

        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "321"});

        await wait(20);

        const logs = logStore.getAll();
        expect(logs).toHaveLength(2);
        expect(logs.find(item => item.test === "123")?.CloneInGroupCounter).toBe(2);
    });

    it("applies grouping across multiple intervals", async () => {
        logStore = new LogStore(storeConfigWithGrouping);

        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "321"});

        await wait(20);

        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "321"});

        await wait(20);

        const logs = logStore.getAll();
        expect(logs).toHaveLength(4);
    });

    it("finalizes grouping immediately when logs are read", () => {
        logStore = new LogStore(storeConfigWithGrouping);

        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "321"});

        let logs = logStore.getAll();
        expect(logs).toHaveLength(2);
        expect(logs.find(item => item.test === "123")?.CloneInGroupCounter).toBe(2);

        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "123"});
        logStore.add({test: "321"});

        logs = logStore.getAll();
        expect(logs).toHaveLength(4);
    });
});
