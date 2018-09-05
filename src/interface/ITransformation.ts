import {TransformationEnum} from "../enums/TransformationEnum";

export default interface ITransformation {
    type: TransformationEnum;
    configuration?: any;
}
