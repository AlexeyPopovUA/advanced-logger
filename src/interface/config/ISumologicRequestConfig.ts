import IRequestConfig from "./IRequestConfig";

export default interface ISumologicRequestConfig extends IRequestConfig {
    sourceCategory: string;
    host: string;
    sourceName: string;
}
