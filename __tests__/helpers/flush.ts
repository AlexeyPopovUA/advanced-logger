import AdvancedLogger from "../../src/AdvancedLogger";
import IDefaultLogConfig from "../../src/interface/config/IDefaultLogConfig";

const wait = (delay: number) => new Promise<void>(resolve => setTimeout(resolve, delay));

export async function flushLogger<T extends IDefaultLogConfig>(
    logger: AdvancedLogger<T>,
    delayMs = 10
): Promise<void> {
    logger.sendAllLogs();
    await wait(delayMs);
}

export {wait};
