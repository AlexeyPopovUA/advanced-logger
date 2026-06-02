import AdvancedLogger from "../../src/AdvancedLogger";
import IDefaultLogConfig from "../../src/interface/config/IDefaultLogConfig";
import ILoggerConfig from "../../src/interface/config/ILoggerConfig";
import IServiceConfig from "../../src/interface/config/IServiceConfig";
import IStrategy from "../../src/interface/IStrategy";
import IService from "../../src/interface/IService";
import SumologicService from "../../src/service/SumologicService";

export const minimalServiceConfig: IServiceConfig = {
    defaultLogConfig: {},
    serviceConfig: {
        sourceCategory: "test-category",
        sourceName: "test-name",
        host: "test-host",
        url: "https://example.com/logs",
        method: "POST",
    },
};

export function createSumologicService(config: IServiceConfig = minimalServiceConfig): SumologicService {
    return new SumologicService(config);
}

export function createLogger<T extends IDefaultLogConfig = IDefaultLogConfig>(
    options: {
        strategy: IStrategy;
        service?: IService;
        transformations?: ILoggerConfig["transformations"];
    }
): AdvancedLogger<T> {
    return new AdvancedLogger<T>({
        service: options.service ?? createSumologicService(),
        strategy: options.strategy,
        transformations: options.transformations,
    });
}
