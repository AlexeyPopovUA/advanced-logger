import {EventEmitter} from "events";
import throttle from "lodash/throttle";
import IAddEventConfig from "../interface/config/IAddEventConfig";
import IStrategy from "./../interface/IStrategy";

export default class OnIntervalStrategy implements IStrategy {
    public eventEmitter: EventEmitter;
    public SEND_INTERVAL = 15000;

    private readonly intervalSend: () => void;

    constructor(config: {interval?: number}) {
        this.eventEmitter = new EventEmitter();

        if (config.interval) {
            this.SEND_INTERVAL = config.interval;
        }

        this.intervalSend = throttle(this.send.bind(this), this.SEND_INTERVAL, {leading: false, trailing: true});
    }

    public onAdd(info?: IAddEventConfig): void {
        if (info && info.logCount > 0) {
            this.intervalSend();
        }
    }

    public onClear(): void {
        // Ignore log list change
        //console.log("OnIntervalStrategy#cleared");
    }

    public sendAll(): void {
        this.eventEmitter.emit("send");
    }

    public destroy(): void {
        this.eventEmitter.removeAllListeners();
        this.eventEmitter = null;
    }

    private send() {
        this.eventEmitter.emit("send");
    }
}
