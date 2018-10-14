import AdvancedLogger from "./AdvancedLogger";
import {TransformationEnum} from "./enums/TransformationEnum";
import LogglyService from "./service/LogglyService";
import SumologicService from "./service/SumologicService";
import InstantStrategy from "./strategy/InstantStrategy";
import OnBundleSizeStrategy from "./strategy/OnBundleSizeStrategy";
import OnIntervalStrategy from "./strategy/OnIntervalStrategy";
import OnRequestStrategy from "./strategy/OnRequestStrategy";

const strategy = {
    InstantStrategy, OnBundleSizeStrategy, OnRequestStrategy, OnIntervalStrategy
};

const service = {
    SumologicService,
    LogglyService
};

export {
    AdvancedLogger,
    strategy,
    service,
    TransformationEnum
};
