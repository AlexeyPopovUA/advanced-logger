import {EventEmitter} from "events";
import IAddEventConfig from "../interface/config/IAddEventConfig";
import IStrategy from "./../interface/IStrategy";

export default class OnRequestStrategy implements IStrategy {
    public eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public onAdd(info?: IAddEventConfig): void {
        // Ignore log list change
    }

    public onClear(): void {
        // Ignore log list change
        //console.log("OnRequestStrategy#cleared");
    }

    public sendAll(): void {
        this.eventEmitter.emit("send");
    }

    public destroy(): void {
        this.eventEmitter.removeAllListeners();
    }
}
