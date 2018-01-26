import {Observable} from "rxjs/Observable";
import IDestructable from "./IDestructable";

export default interface IStrategy extends IDestructable {
    sendObservable: Observable<any>;

    onAdd(info?: any): void;

    onClear(): void;

    sendAll(info?: any): void;
}
