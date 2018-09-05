import ILog from "../interface/ILog";

const DELIMETER = "-";

export default {
    getLogIdByFields(log: ILog, fields: string[]): string {
        return fields.map(field => `${field}${DELIMETER}${log[field]}`).join(DELIMETER);
    }
};
