import IRequestConfig from "../interface/config/IRequestConfig";
//todo Resolve webpack transformation problem with "fetch"
const fetch = require("./fetchFacade");

const http = {
    postRequest(serviceConfig: IRequestConfig, headers: any, payload: string): Promise<Response> {
        return fetch(serviceConfig.url, {
            method: serviceConfig.method,
            body: payload,
            headers
        });
    },

    delayedRetry(retries: number, delay = 0, fn: () => Promise<Response>): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            setTimeout(() => fn().then(resolve).catch(reject), delay);
        })
            .catch(error => retries > 1 ? http.delayedRetry(retries - 1, delay, fn) : Promise.reject(error));
    }
};

export default http;
