import ISumologicRequestConfig from "../interface/config/ISumologicRequestConfig";
import fetch from "./fetchFacade";

export default {
    postRequest(serviceConfig: ISumologicRequestConfig, payload: string): Promise<Response> {
        console.log("postRequest");
        return fetch(serviceConfig.url, {
            method: serviceConfig.method,
            body: payload,
            headers: {
                "Content-Type": "application/json",
                "X-Sumo-Category": serviceConfig.sourceCategory,
                "X-Sumo-Host": serviceConfig.host,
                "X-Sumo-Name": serviceConfig.sourceName
            }
        });
    }
};
