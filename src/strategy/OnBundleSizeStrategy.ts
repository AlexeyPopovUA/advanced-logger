import {EventEmitter} from "events";
import IStrategy from "./../interface/IStrategy";

export default class OnBundleSizeStrategy implements IStrategy {
    public eventEmitter: EventEmitter;

    /**
     * @todo Take it from config
     * @type {number}
     */
    public MAX_BUNDLE_SIZE: number = 100;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public onAdd(info: any): void {
        if (info && info.count >= this.MAX_BUNDLE_SIZE) {
            this.eventEmitter.emit("send");
        } else {
            console.log("Not enough logs so far");
        }
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
