import {Observable, Observer} from "@reactivex/rxjs";

export default class LogStore {
    /**
     * Subscribe in order to receive "add" event
     */
    public addObservable: Observable;
    /**
     * Subscribe in order to receive "cleared" event
     */
    public clearObservable: Observable;

    private addObserver: Observer;
    private clearObserver: Observer;

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
        this.addObserver.next(log);
    }

    public clear(): void {
        this.logs.clear();
        this.clearObserver.next();
    }

    public getAll(): any[] {
        return [...this.logs];
    }

    public size(): number {
        return this.logs.size;
    }

    public getRealLogCount(): number {
        // todo Take into account the "groupped" counter
        return this.logs.size;
    }
}
