import {Observable, Observer} from "@reactivex/rxjs";
import IStrategy from "./../interface/IStrategy";

export default class OnRequestStrategy implements IStrategy {
    public sendObservable: Observable;

    private sendObserver: Observer;

    constructor() {
        this.sendObservable = Observable.create(observer => {
            this.sendObserver = observer;
        });
    }

    public onAdd(info?: any): void {
        // Ignore log list change
    }

    public onClear(): void {
        // Ignore log list change
    }

    public sendAll(info?: any): void {
        this.sendObserver.next();
    }

    public destroy(): void {
        this.sendObserver.complete();
        this.sendObserver = null;
        this.sendObservable = null;
    }
}
