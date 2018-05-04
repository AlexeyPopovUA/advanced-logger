import {EventEmitter} from "events";
import IDestructable from "./interface/IDestructable";

export default class LogStore implements IDestructable {
    /**
     * Subscribe in order to receive "add", "cleared" events
     */
    public eventEmitter: EventEmitter;

    private readonly logs: Set<any>;

    constructor() {
        this.logs = new Set();
        this.eventEmitter = new EventEmitter();
    }

    public add(log: any): void {
        this.logs.add(log);
        this.eventEmitter.emit("add", {
            logCount: this.getRealLogCount(),
            recordCount: this.size()
        });
    }

    public clear(): void {
        this.logs.clear();
        this.eventEmitter.emit("clear", null);
    }

    public getAll(): any[] {
        return [...this.logs];
    }

    public size(): number {
        return this.logs.size;
    }

    public getRealLogCount(): number {
        // todo Take into account the "grouped" counter. Optimize calculation speed using caching in add method
        return this.logs.size;
    }

    public destroy(): void {
        this.logs.clear();

        this.eventEmitter.removeAllListeners();
        this.eventEmitter = null;
    }
}
