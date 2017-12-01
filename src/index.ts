import SumologicService from "./service/SumologicService";
import InstantStrategy from "./strategy/InstantStrategy";
import OnBundleSizeStrategy from "./strategy/OnBundleSizeStrategy";
import OnRequestStrategy from "./strategy/OnRequestStrategy";
import UniversalLogger from "./UniversalLogger";

const strategy = {
    InstantStrategy, OnBundleSizeStrategy, OnRequestStrategy
};

const service = {
    SumologicService
};

export {
    UniversalLogger,
    strategy,
    service
};
