import {EventEmitter} from "../util/EventEmitter";
import IAddEventConfig from "./config/IAddEventConfig";
import IDestructable from "./IDestructable";

export default interface IStrategy extends IDestructable {
    eventEmitter: EventEmitter;

    onAdd(info?: IAddEventConfig): void;

    onClear(): void;

    sendAll(): void;
}
