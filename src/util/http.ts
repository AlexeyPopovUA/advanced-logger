import axios from "axios";

import IRequestConfig from "../interface/config/IRequestConfig";

const http = {
    request(serviceConfig: IRequestConfig, headers: any, payload: string): Promise<Response> {
        return axios.request({
            method: serviceConfig.method,
            headers,
            url: serviceConfig.url,
            data: payload
        })
    },

    delayedRetry(retries: number, delay: number, fn: () => Promise<Response>): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            setTimeout(() => fn().then(resolve).catch(reject), delay);
        })
            .catch(error => retries > 1 ? http.delayedRetry(retries - 1, delay, fn) : Promise.reject(error));
    }
};

export default http;
