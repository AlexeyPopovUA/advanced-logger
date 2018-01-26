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

export default function postRequest(...args): Promise<any> {
    return nodePostRequest.apply(null, args);
}
