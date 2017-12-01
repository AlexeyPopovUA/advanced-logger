import {Observable} from "@reactivex/rxjs";
import IDestructable from "./IDestructable";

export default interface IStrategy extends IDestructable {
    sendObservable: Observable;

    onAdd(info?: any): void;

    onClear(): void;

    sendAll(info?: any): void;
}
