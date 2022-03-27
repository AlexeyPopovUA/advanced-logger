import {TransformationEnum} from "../enums/TransformationEnum";
import IGroupTransformation from "./IGroupTransformation";

export default interface ITransformation {
    type: TransformationEnum;
    // TODO Review configuration type
    configuration: IGroupTransformation;
}
