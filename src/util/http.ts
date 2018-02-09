import * as https from "https";
import * as url from "url";

function nodePostRequest(
    serviceConfig: {
        sourceCategory: string,
        host: string,
        url: string,
        sourceName: string
    },
    payload: string): Promise<any> {

    const urlConfig = url.parse(serviceConfig.url);

    const postOptions = {
        method: "POST",
        hostname: urlConfig.hostname,
        port: urlConfig.port,
        path: urlConfig.pathname
    };

    return new Promise((resolve, reject) => {
        const req = https.request(postOptions, response => {
            console.log(`STATUS: ${response.statusCode}`);
            //console.warn(`response:`, response);
            resolve({});
        });

        //req.setDefaultEncoding("utf8");
        req.setHeader("Content-Type", "application/json");
        req.setHeader("X-Sumo-Category", serviceConfig.sourceCategory);
        req.setHeader("X-Sumo-Host", serviceConfig.host);
        req.setHeader("X-Sumo-Name", serviceConfig.sourceName);

        req.on("error", error => reject(error));
        req.write(payload);
        req.end();
    });
}

export default function postRequest(...args): Promise<any> {
    return nodePostRequest.apply(null, args);
}
