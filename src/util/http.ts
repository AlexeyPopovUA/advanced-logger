import ISumologicRequestConfig from "../interface/config/ISumologicRequestConfig";
//todo Resolve webpack transformation problem with "fetch"
const fetch = require("./fetchFacade");

export default {
    postRequest(serviceConfig: ISumologicRequestConfig, payload: string): Promise<Response> {
        return fetch(serviceConfig.url, {
            method: serviceConfig.method,
            body: payload,
            headers: {
                "Content-Type": "application/json",
                //todo Optional?
                "X-Sumo-Category": serviceConfig.sourceCategory,
                //todo Optional?
                "X-Sumo-Host": serviceConfig.host,
                //todo Optional?
                "X-Sumo-Name": serviceConfig.sourceName
            }
        });
    }
};
