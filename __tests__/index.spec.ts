"use strict";

import "jest";
import Logger from "../src/index";

describe("Example", () => {
    it("Should be pass sanity", () => {
        expect(typeof Logger).toBe("function");
    });

    it("Should be able to create new instance", (done) => {
        const service = {
            initialize: () => {
                return Promise.resolve();
            },
            sendAllLogs: ([]) => {
                return Promise.resolve();
            }
        };

        const logger = new Logger({
            loggingService: service,
            strategy: "smth"
        });

        logger.initialize()
            .then(() => done())
            .catch((e) => done(e));
    });
});
