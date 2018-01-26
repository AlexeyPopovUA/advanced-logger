import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import IDestructable from "./interface/IDestructable";

export default class LogStore implements IDestructable {
    /**
     * Subscribe in order to receive "add" event
     */
    public addObservable: Observable<any>;
    /**
     * Subscribe in order to receive "cleared" event
     */
    public clearObservable: Observable<any>;

    private addObserver: Observer<any>;
    private clearObserver: Observer<any>;

    private logs: Set<any>;

    constructor() {
        this.logs = new Set();

        this.addObservable = Observable.create(observer => {
            this.addObserver = observer;
        });

        this.clearObservable = Observable.create(observer => {
            this.clearObserver = observer;
        });
    }

    public add(log: any): void {
        this.logs.add(log);
        this.addObserver.next({
            logCount: this.getRealLogCount(),
            recordCount: this.size()
        });
    }

    public clear(): void {
        this.logs.clear();
        this.clearObserver.next(null);
    }

    public getAll(): any[] {
        return [...this.logs];
    }

    public size(): number {
        return this.logs.size;
    }

    public getRealLogCount(): number {
        // todo Take into account the "grouped" counter. Optimize calculation speed using caching in add method
        return this.logs.size;
    }

    public destroy(): void {
        this.logs.clear();

        if (this.addObserver) {
            this.addObserver.complete();
        }

        if (this.clearObserver) {
            this.clearObserver.complete();
        }

        this.addObservable = null;
        this.clearObservable = null;
    }
}
