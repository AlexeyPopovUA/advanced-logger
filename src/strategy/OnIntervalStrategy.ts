import {EventEmitter} from "events";
const debounce = require("lodash/debounce");
import IStrategy from "./../interface/IStrategy";

export default class OnIntervalStrategy implements IStrategy {
    public eventEmitter: EventEmitter;

    /**
     * @type {number}
     */
    public SEND_INTERVAL: number = 15000;

    private readonly debouncedSend: () => void;

    constructor(config: {interval?: number}) {
        this.eventEmitter = new EventEmitter();

        if (config.interval) {
            this.SEND_INTERVAL = config.interval;
        }

        this.debouncedSend = debounce(this.send.bind(this), this.SEND_INTERVAL);
    }

    public onAdd(info: any): void {
        if (info && info.logCount > 0) {
            this.debouncedSend();
        }
    }

    public onClear(): void {
        // Ignore log list change
        console.log("OnIntervalStrategy#cleared");
    }

    public sendAll(info?: any): void {
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
