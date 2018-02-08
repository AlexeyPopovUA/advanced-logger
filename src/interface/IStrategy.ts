import {EventEmitter} from "events";
import IDestructable from "./IDestructable";

export default interface IStrategy extends IDestructable {
    eventEmitter: EventEmitter;

    onAdd(info?: any): void;

    onClear(): void;

    sendAll(info?: any): void;
}
