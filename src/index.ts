import AdvancedLogger from "./AdvancedLogger";
import SumologicService from "./service/SumologicService";
import InstantStrategy from "./strategy/InstantStrategy";
import OnBundleSizeStrategy from "./strategy/OnBundleSizeStrategy";
import OnRequestStrategy from "./strategy/OnRequestStrategy";

const strategy = {
    InstantStrategy, OnBundleSizeStrategy, OnRequestStrategy
};

const service = {
    SumologicService
};

export {
    AdvancedLogger,
    strategy,
    service
};
