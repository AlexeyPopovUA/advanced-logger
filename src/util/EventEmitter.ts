type Listener = (...args: any[]) => void;

export class EventEmitter {
    private listeners = new Map<string, Set<Listener>>();

    on(event: string, fn: Listener): this {
        (this.listeners.get(event) ?? this.set(event)).add(fn);
        return this;
    }

    once(event: string, fn: Listener): this {
        const wrap: Listener = (...args) => {
            this.off(event, wrap);
            fn(...args);
        };
        return this.on(event, wrap);
    }

    off(event: string, fn: Listener): this {
        this.listeners.get(event)?.delete(fn);
        return this;
    }

    removeListener(event: string, fn: Listener): this {
        return this.off(event, fn);
    }

    emit(event: string, ...args: any[]): boolean {
        const set = this.listeners.get(event);
        if (!set || set.size === 0) {
            return false;
        }
        for (const fn of [...set]) {
            fn(...args);
        }
        return true;
    }

    removeAllListeners(event?: string): this {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
        return this;
    }

    private set(event: string): Set<Listener> {
        const s = new Set<Listener>();
        this.listeners.set(event, s);
        return s;
    }
}
