import {EventEmitter} from "events";

export function onceEvent(emitter: EventEmitter, event: string): Promise<void> {
    return new Promise((resolve, reject) => {
        emitter.once(event, resolve);
        emitter.once("error", reject);
    });
}
