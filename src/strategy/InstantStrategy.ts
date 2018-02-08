import {EventEmitter} from "events";
import IStrategy from "./../interface/IStrategy";

export default class InstantStrategy implements IStrategy {
    public eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public onAdd(info?: any): void {
        this.sendAll();
    }

    public onClear(): void {
        // Ignore log list change
    }

    public sendAll(info?: any): void {
        this.eventEmitter.emit("send");
    }

    public destroy(): void {
        this.eventEmitter.removeAllListeners();
        this.eventEmitter = null;
    }
}
