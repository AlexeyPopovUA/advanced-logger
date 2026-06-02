import IRequestConfig from "../interface/config/IRequestConfig";

const http = {
    async request(serviceConfig: IRequestConfig, headers: Record<string, string>, payload: string): Promise<Response> {
        const response = await fetch(serviceConfig.url, {
            method: serviceConfig.method,
            headers,
            body: payload
        });

        // fetch only rejects on network errors, so surface non-2xx responses
        // as errors to preserve the retry-on-failure contract.
        if (!response.ok) {
            throw new Error(`Request to ${serviceConfig.url} failed with status ${response.status}`);
        }

        return response;
    },

    delayedRetry(retries: number, delay: number, fn: () => Promise<Response>): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            setTimeout(() => fn().then(resolve).catch(reject), delay);
        })
            .catch(error => retries > 1 ? http.delayedRetry(retries - 1, delay, fn) : Promise.reject(error));
    }
};

export default http;
