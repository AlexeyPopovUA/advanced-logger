import * as http from "http";

function nodePostRequest(
    serviceConfig: {
        sourceCategory: string,
        host: string,
        url: string,
        sourceName?: string
    },
    payload: string): Promise<any> {

    // todo Set url properties from config
    const postOptions = {
        body: payload,
        method: "POST",
        hostname: "hostname",
        port: 1234,
        path: "/pathname",
    };

    return new Promise((resolve, reject) => {
        const req = http.request(postOptions, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding("utf8");
            res.on("end", () => {
                console.log("result");
                resolve("result!");
            });
        });

        req.setHeader("Content-Type", "application/json");
        req.setHeader("X-Sumo-Category", serviceConfig.sourceCategory);
        req.setHeader("X-Sumo-Host", serviceConfig.host);
        req.setHeader("X-Sumo-Name", serviceConfig.sourceName || "");

        req.on("error", e => reject(e));
        req.end();
    });
}

export default function postRequest(...args): Promise<any> {
    return nodePostRequest.apply(null, args);
}
