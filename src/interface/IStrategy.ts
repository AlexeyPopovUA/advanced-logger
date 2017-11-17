import {Observable} from "@reactivex/rxjs";

export default interface IStrategy {
    sendObservable: Observable;

    onAdd(info?: any): void;

    onClear(): void;

    sendAll(info?: any): void;
}
