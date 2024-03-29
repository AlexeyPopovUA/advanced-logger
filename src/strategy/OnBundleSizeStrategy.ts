import {EventEmitter} from "events";
import IAddEventConfig from "../interface/config/IAddEventConfig";
import IStrategy from "./../interface/IStrategy";

export default class OnBundleSizeStrategy implements IStrategy {
    public eventEmitter: EventEmitter;

    /**
     * @type {number}
     */
    public MAX_BUNDLE_SIZE: number = 100;

    constructor(config: {maxBundle?: number}) {
        this.eventEmitter = new EventEmitter();

        if (config.maxBundle) {
            this.MAX_BUNDLE_SIZE = config.maxBundle;
        }
    }

    public onAdd(info: IAddEventConfig): void {
        if (info && info.logCount >= this.MAX_BUNDLE_SIZE) {
            this.eventEmitter.emit("send");
        } else {
            //console.log("Not enough logs so far");
        }
    }

    public onClear(): void {
        // Ignore log list change
        //console.log("OnBundleSizeStrategy#cleared");
    }

    public sendAll(): void {
        this.eventEmitter.emit("send");
    }

    public destroy(): void {
        this.eventEmitter.removeAllListeners();
    }
}
