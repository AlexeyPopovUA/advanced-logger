import ServiceFacade from "../ServiceFacade";

export default interface IStrategy {
    facade: ServiceFacade;

    log(log: any): void;

    sendAllLogs(): Promise<any>;
}
