import axios from "axios";

import {wait} from "../../helpers/flush";

export interface BuiltLoggerApi {
    AdvancedLogger: new (config: {
        service: unknown;
        strategy: unknown;
        transformations?: unknown[];
    }) => {
        log: (log: Record<string, string>) => void;
        sendAllLogs: () => void;
        destroy: () => void;
    };
    service: {
        ConsoleService: new () => unknown;
        SumologicService: new (config: unknown) => unknown;
    };
    strategy: {
        OnRequestStrategy: new () => unknown;
    };
    TransformationEnum: {
        RAPID_FIRE_GROUPING: number;
    };
}

const sumologicServiceConfig = {
    defaultLogConfig: {},
    serviceConfig: {
        sourceCategory: "test-category",
        sourceName: "test-name",
        host: "test-host",
        url: "https://example.com/logs",
        method: "POST",
    },
};

export function assertPublicApi(api: BuiltLoggerApi): void {
    expect(api.AdvancedLogger).toBeDefined();
    expect(api.service.ConsoleService).toBeDefined();
    expect(api.service.SumologicService).toBeDefined();
    expect(api.strategy.OnRequestStrategy).toBeDefined();
    expect(api.TransformationEnum.RAPID_FIRE_GROUPING).toBeDefined();
}

export async function exerciseConsoleOnRequestFlush(api: BuiltLoggerApi): Promise<void> {
    const logger = new api.AdvancedLogger({
        service: new api.service.ConsoleService(),
        strategy: new api.strategy.OnRequestStrategy(),
    });

    logger.log({test: "first"});
    logger.log({test: "second"});
    logger.sendAllLogs();
    logger.destroy();
}

export async function exerciseSumologicFlushWithAxios(api: BuiltLoggerApi): Promise<void> {
    jest.mocked(axios.request).mockResolvedValue({} as never);

    const logger = new api.AdvancedLogger({
        service: new api.service.SumologicService(sumologicServiceConfig),
        strategy: new api.strategy.OnRequestStrategy(),
    });

    logger.log({test: "test123"});
    logger.log({test: "test321"});
    logger.sendAllLogs();

    await wait(10);

    expect(jest.mocked(axios.request)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(axios.request)).toHaveBeenCalledWith(
        expect.objectContaining({
            data: expect.stringMatching(/test123[\s\S]*test321|test321[\s\S]*test123/),
        })
    );

    logger.destroy();
}
