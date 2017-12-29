import * as request from "request-promise-native";

function nodePostRequest(
    serviceConfig: {
        sourceCategory: string,
        host: string,
        url: string,
        sourceName?: string
    },
    payload: string): Promise<any> {

    const postOptions = {
        body: payload,
        headers: {
            "Content-Type": "application/json",
            "X-Sumo-Category": serviceConfig.sourceCategory,
            "X-Sumo-Host": serviceConfig.host,
            "X-Sumo-Name": serviceConfig.sourceName || ""
        },
        method: "POST",
        uri: serviceConfig.url
    };

    return request(postOptions);
}

function browserPostRequest(
    serviceConfig: {
        sourceCategory: string,
        host: string,
        url: string,
        sourceName?: string
    },
    payload: string): Promise<any> {

    const postOptions = {
        body: payload,
        headers: {
            "Content-Type": "application/json",
            "X-Sumo-Category": serviceConfig.sourceCategory,
            "X-Sumo-Host": serviceConfig.host,
            "X-Sumo-Name": serviceConfig.sourceName
        },
        method: "POST",
        uri: serviceConfig.url
    };

    return Promise.resolve();
}

export default function postRequest(...args): Promise<any> {
    if (typeof global !== "undefined") {
        return nodePostRequest.apply(null, args);
    } else {
        return browserPostRequest.apply(null, args);
    }
}
