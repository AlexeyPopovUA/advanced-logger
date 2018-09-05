import {EventEmitter} from "events";
import IStrategy from "./../interface/IStrategy";

export default class InstantStrategy implements IStrategy {
    public eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public onAdd(info?: any): void {
        this.eventEmitter.emit("send");
        //console.log("InstantStrategy#sent");
    }

    public onClear(): void {
        // Ignore log list change
        //console.log("InstantStrategy#cleared");
    }

    public sendAll(info?: any): void {
        // This strategy sends all logs separately
    }

    public destroy(): void {
        this.eventEmitter.removeAllListeners();
        this.eventEmitter = null;
    }
}
