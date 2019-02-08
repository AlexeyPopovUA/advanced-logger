import BaseRemoteService from "./BaseRemoteService";

export default class LogglyService extends BaseRemoteService {
    protected getHeaders(): any {
        return {
            "Content-Type": "text/plain"
        };
    }
}
