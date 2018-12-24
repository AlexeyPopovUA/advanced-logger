import {TransformationEnum} from "..";
import IGroupTransformation from "./IGroupTransformation";

export default interface ITransformation {
    type: TransformationEnum;
    configuration?: IGroupTransformation;
}
