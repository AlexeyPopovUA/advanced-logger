import {Observable, Observer} from "@reactivex/rxjs";
import IStrategy from "./../interface/IStrategy";

export default class OnBundleSizeStrategy implements IStrategy {
    public sendObservable: Observable;

    /**
     * @todo Take it from config
     * @type {number}
     */
    public MAX_BUNDLE_SIZE: number = 100;

    private sendObserver: Observer;

    constructor() {
        this.sendObservable = Observable.create(observer => {
            this.sendObserver = observer;
        });
    }

    public onAdd(info: any): void {
        if (info && info.count >= this.MAX_BUNDLE_SIZE) {
            this.sendObserver.next();
        } else {
            console.log("Not enough logs so far");
        }
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
