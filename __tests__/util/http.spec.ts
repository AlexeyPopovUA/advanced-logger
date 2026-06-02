import http from "../../src/util/http";

describe("http.delayedRetry", () => {
    it("calls the function once when it succeeds immediately", async () => {
        const fn = jest.fn().mockResolvedValue(null);

        await http.delayedRetry(3, 1, fn);

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("calls the function once when delay is zero and it succeeds", async () => {
        const fn = jest.fn().mockResolvedValue(null);

        await http.delayedRetry(3, 0, fn);

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("retries up to the configured attempt count before failing", async () => {
        const fn = jest.fn().mockRejectedValue(new Error("fail"));

        await expect(http.delayedRetry(3, 1, fn)).rejects.toThrow("fail");

        expect(fn).toHaveBeenCalledTimes(3);
    });

    it("succeeds when a later retry resolves", async () => {
        const fn = jest
            .fn()
            .mockRejectedValueOnce(new Error("fail"))
            .mockResolvedValueOnce(null);

        await http.delayedRetry(3, 1, fn);

        expect(fn).toHaveBeenCalledTimes(2);
    });
});
