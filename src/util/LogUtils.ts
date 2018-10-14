import ILog from "../interface/ILog";

const DELIMETER = "-";

export default {
    getLogIdByFields(log: ILog, fields: string[]): string {
        return fields.map(field => `${field}${DELIMETER}${log[field]}`).join(DELIMETER);
    },

    /**
     * It is necessary to convert objects safely, otherwise we can lost the whole log bundle
     */
    tryJSONStringify(obj: any): string {
        try {
            return JSON.stringify(obj);
        } catch (_) {
            //ignore the error
            return "";
        }
    }
};
