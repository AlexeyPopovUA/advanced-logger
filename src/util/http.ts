import {XMLHttpRequest} from "./browserHTTP";

function nodePostRequest(
    serviceConfig: {
        sourceCategory: string,
        host: string,
        url: string,
        sourceName: string,
        method: string
    },
    payload: string): Promise<any> {

    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.addEventListener("load", () => resolve({}));
        request.addEventListener("error", error => reject(error));
        request.open(serviceConfig.method, serviceConfig.url);
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("X-Sumo-Category", serviceConfig.sourceCategory);
        request.setRequestHeader("X-Sumo-Host", serviceConfig.host);
        request.setRequestHeader("X-Sumo-Name", serviceConfig.sourceName);
        request.send(payload);
    });
}

export default function postRequest(...args): Promise<any> {
    return nodePostRequest.apply(null, args);
}
