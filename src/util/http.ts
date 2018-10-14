import IRequestConfig from "../interface/config/IRequestConfig";
//todo Resolve webpack transformation problem with "fetch"
const fetch = require("./fetchFacade");

export default {
    postRequest(serviceConfig: IRequestConfig, headers: any, payload: string): Promise<Response> {
        return fetch(serviceConfig.url, {
            method: serviceConfig.method,
            body: payload,
            headers
        });
    }
};
