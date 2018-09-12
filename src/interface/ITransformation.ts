import {TransformationEnum} from "..";

export default interface ITransformation {
    type: TransformationEnum;
    //todo Add the config type
    configuration?: any;
}
