import ConsoleService from "../../src/service/ConsoleService";

describe("ConsoleService", () => {
    let service: ConsoleService;

    afterEach(() => {
        service?.destroy();
    });

    it("resolves when sending logs", async () => {
        service = new ConsoleService();

        await expect(
            service.sendAllLogs([{test: "test123"}, {test: "test321"}])
        ).resolves.toBeUndefined();
    });

    it("returns log objects unchanged from the serializer", () => {
        service = new ConsoleService();
        const log = {test: "test123"};

        expect(service.serializer(log)).toBe(log);
    });

    it("preserves log object references in the prepared payload", async () => {
        service = new ConsoleService();
        const testLogs = [{test: "test123"}, {test: "test321"}];

        const payload = await service.preparePayload(testLogs);

        expect(payload).toHaveLength(2);
        expect(payload[0]).toBe(testLogs[0]);
        expect(payload[1]).toBe(testLogs[1]);
    });
});
