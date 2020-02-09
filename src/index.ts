import AdvancedLogger from "./AdvancedLogger";
import {TransformationEnum} from "./enums/TransformationEnum";
import BaseRemoteService from "./service/BaseRemoteService";
import ConsoleService from "./service/ConsoleService";
import ElasticsearchService from "./service/ElasticsearchService";
import LogglyService from "./service/LogglyService";
import SumologicService from "./service/SumologicService";
import InstantStrategy from "./strategy/InstantStrategy";
import OnBundleSizeStrategy from "./strategy/OnBundleSizeStrategy";
import OnIntervalStrategy from "./strategy/OnIntervalStrategy";
import OnRequestStrategy from "./strategy/OnRequestStrategy";

const strategy = {
    InstantStrategy,
    OnBundleSizeStrategy,
    OnRequestStrategy,
    OnIntervalStrategy
};

const service = {
    BaseRemoteService,
    SumologicService,
    LogglyService,
    ConsoleService,
    ElasticsearchService
};

export {
    AdvancedLogger,
    strategy,
    service,
    TransformationEnum
};
