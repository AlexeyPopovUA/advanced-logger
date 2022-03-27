import ConsoleService from "../../src/service/ConsoleService";

describe("ConsoleService", () => {
    let service: ConsoleService;

    afterEach(() => {
        if (service) {
            service.destroy();
        }
    });

    it("Should export service", () => {
        expect(typeof ConsoleService).toBe("function");
    });

    it("Should be able to create a new service instance", () => {
        expect(() => {
            service = new ConsoleService();
        }).not.toThrow();

        expect(service).toBeTruthy();
    });

    it("Should not fail during logs sending step", done => {
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        service = new ConsoleService();
        service.sendAllLogs(testLogs)
            .then(() => done())
            .catch(() => done("should not fail"));
    });

    it("'serializer' should not replace log objects", () => {
        const testLog = {test: "test123"};

        service = new ConsoleService();
        const result = service.serializer(testLog);
        expect(result).toBe(testLog);
    });

    it("Should not replace log objects on preparation step", async () => {
        const testLogs = [
            {test: "test123"},
            {test: "test321"}
        ];

        service = new ConsoleService();
        const payload = await service.preparePayload(testLogs);

        expect(payload).toBeInstanceOf(Array);
        expect(payload.length).toBe(2);
        expect(payload[0]).toBe(testLogs[0]);
        expect(payload[1]).toBe(testLogs[1]);
    });
});
