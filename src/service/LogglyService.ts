import BaseRemoteService from "./BaseRemoteService";

export default class LogglyService extends BaseRemoteService {
    protected getHeaders(): {[propName: string]: string} {
        return {
            "Content-Type": "text/plain"
        };
    }
}
