import AdvancedLogger from "./AdvancedLogger";
import SumologicService from "./service/SumologicService";
import InstantStrategy from "./strategy/InstantStrategy";
import OnBundleSizeStrategy from "./strategy/OnBundleSizeStrategy";
import OnIntervalStrategy from "./strategy/OnIntervalStrategy";
import OnRequestStrategy from "./strategy/OnRequestStrategy";

const strategy = {
    InstantStrategy, OnBundleSizeStrategy, OnRequestStrategy, OnIntervalStrategy
};

const service = {
    SumologicService
};

export {
    AdvancedLogger,
    strategy,
    service
};
