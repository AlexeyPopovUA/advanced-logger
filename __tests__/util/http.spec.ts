"use strict";

import "jest";
import http from "../../src/util/http";

describe("http", () => {
    it("delayedRetry does not retry if successful", done => {
        const mock = jest.fn().mockResolvedValue(null);
        http.delayedRetry(3, 1, mock)
            .then(() => {
                expect(mock).toHaveBeenCalledTimes(1);
                done();
            })
            .catch(error => done(error));
    });

    it("delayedRetry does not retry if successful with default delay", done => {
        const mock = jest.fn().mockResolvedValue(null);
        http.delayedRetry(3, undefined, mock)
            .then(() => {
                expect(mock).toHaveBeenCalledTimes(1);
                done();
            })
            .catch(error => done(error));
    });

    it("delayedRetry retries and fails at the end", done => {
        const mock = jest.fn().mockRejectedValue(null);
        http.delayedRetry(3, 1, mock)
            .then(() => {
                done("should fail");
            })
            .catch(() => {
                expect(mock).toHaveBeenCalledTimes(3);
                done();
            });
    });

    it("delayedRetry recovers after failed retries", done => {
        const mock = jest.fn().mockImplementation(() => {
            mock.mockResolvedValue(null);
            return Promise.reject("Should not fail");
        });

        http.delayedRetry(3, 1, mock)
            .then(() => {
                expect(mock).toHaveBeenCalledTimes(2);
                done();
            })
            .catch(error => done(error));
    });
});
