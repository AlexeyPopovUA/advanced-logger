import IDefaultLogConfig from "../interface/config/IDefaultLogConfig";

const DELIMETER = "-";

export default {
    getLogIdByFields<T extends IDefaultLogConfig>(log: T, fields: string[]): string {
        return fields.map(field => `${field}${DELIMETER}${log[field]}`).join(DELIMETER);
    },

    /**
     * It is necessary to convert objects safely, otherwise we can lost the whole log bundle
     */
    tryJSONStringify<T>(obj: T): string {
        try {
            return JSON.stringify(obj);
        } catch (_) {
            //ignore the error
            return "";
        }
    }
};
