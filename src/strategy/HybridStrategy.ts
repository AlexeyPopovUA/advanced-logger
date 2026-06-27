import {EventEmitter} from "../util/EventEmitter";
import throttle from "lodash-es/throttle";
import IAddEventConfig from "../interface/config/IAddEventConfig";
import IStrategy from "./../interface/IStrategy";

export default class HybridStrategy implements IStrategy {
    public eventEmitter: EventEmitter;
    public MAX_BUNDLE_SIZE: number = 100;
    public SEND_INTERVAL = 15000;

    private readonly intervalSend: ReturnType<typeof throttle>;

    constructor(config: {maxBundle?: number; interval?: number} = {}) {
        this.eventEmitter = new EventEmitter();

        if (config.maxBundle) {
            this.MAX_BUNDLE_SIZE = config.maxBundle;
        }

        if (config.interval) {
            this.SEND_INTERVAL = config.interval;
        }

        this.intervalSend = throttle(this.send.bind(this), this.SEND_INTERVAL, {leading: false, trailing: true});
    }

    public onAdd(info?: IAddEventConfig): void {
        if (!info) {
            return;
        }

        if (info.logCount >= this.MAX_BUNDLE_SIZE) {
            this.intervalSend.cancel();
            this.eventEmitter.emit("send");
        } else if (info.logCount > 0) {
            this.intervalSend();
        }
    }

    public onClear(): void {
        // Ignore log list change
    }

    public sendAll(): void {
        this.eventEmitter.emit("send");
    }

    public destroy(): void {
        this.intervalSend.cancel();
        this.eventEmitter.removeAllListeners();
    }

    private send() {
        this.eventEmitter.emit("send");
    }
}
