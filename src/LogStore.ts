import {EventEmitter} from "events";
import {DebouncedFunc} from "lodash";
import throttle from "lodash/throttle";

import LogUtils from "./util/LogUtils";
import {TransformationEnum} from "./enums/TransformationEnum";
import ILogStoreConfig from "./interface/config/ILogStoreConfig";
import IDestructable from "./interface/IDestructable";
import IGroupTransformation from "./interface/IGroupTransformation";
import IDefaultLogConfig from "./interface/config/IDefaultLogConfig";

export default class LogStore<T extends IDefaultLogConfig> implements IDestructable {
    /**
     * Subscribe in order to receive "add", "cleared" events
     */
    public readonly eventEmitter: EventEmitter;

    private readonly logs: T[];

    private readonly config: ILogStoreConfig;

    private readonly identityMap: Map<string, number>;

    private groupLeftIndex: number = -1;

    private readonly groupableConfig: IGroupTransformation | undefined;

    // todo Proper typing for method is needed
    private throttledOnGroupFinalize: DebouncedFunc<any> | undefined;

    constructor(config: ILogStoreConfig) {
        this.logs = [];
        this.eventEmitter = new EventEmitter();
        this.config = config;

        this.identityMap = new Map<string, number>();

        if (this.config.transformations) {
            const groupableConfig = this.config.transformations
                .find(value => value.type === TransformationEnum.RAPID_FIRE_GROUPING);

            if (groupableConfig) {
                this.groupableConfig = groupableConfig.configuration;

                this.throttledOnGroupFinalize = throttle(this.onGroupFinalize.bind(this),
                    this.groupableConfig.interval, {trailing: true, leading: false});

                //todo Maybe, move to add method
                this.eventEmitter.on("add", this.throttledOnGroupFinalize);
            }
        }
    }

    public add(log: T): void {
        if (this.groupableConfig) {
            const id = LogUtils.getLogIdByFields(log, this.groupableConfig.groupIdentityFields);

            if (!this.identityMap.has(id)) {
                this.logs.push(log);
            }

            this.onAddToGroup(log);
        } else {
            this.logs.push(log);
        }

        this.eventEmitter.emit("add", {
            logCount: this.size()
        });
    }

    public clear(): void {
        this.logs.length = 0;
        this.eventEmitter.emit("clear");
    }

    public getAll(): T[] {
        if (this.throttledOnGroupFinalize) {
            this.throttledOnGroupFinalize.flush();
        }

        return this.logs.slice();
    }

    public size(): number {
        return this.logs.length;
    }

    public destroy(): void {
        if (this.throttledOnGroupFinalize) {
            this.throttledOnGroupFinalize.cancel();
        }

        this.logs.splice(0);
        this.eventEmitter.removeAllListeners();
    }

    private onAddToGroup(log: T): void {
        const logId = LogUtils.getLogIdByFields(log, this.groupableConfig!.groupIdentityFields);

        if (this.identityMap.has(logId)) {
            const savedCounter = this.identityMap.get(logId);
            this.identityMap.set(logId, (savedCounter || 0) + 1);
        } else {
            this.identityMap.set(logId, 1);
        }
    }

    private onGroupFinalize(): void {
        // Apply grouping counters from Map to logs range from left index to the last
        const len = this.logs.length;

        if (len > 0) {
            for (let i = this.groupLeftIndex !== -1 ? this.groupLeftIndex : 0; i < len; i++) {
                const log = this.logs[i];
                const id = LogUtils.getLogIdByFields(log, this.groupableConfig!.groupIdentityFields);

                Object.assign(log, {[this.groupableConfig!.groupFieldName]: this.identityMap.has(id) ? this.identityMap.get(id) : 1});
            }
        }

        this.groupLeftIndex = len > 0 ? len - 1 : -1;
        this.identityMap.clear();
    }
}
