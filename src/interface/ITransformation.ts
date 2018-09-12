import {TransformationEnum} from "..";

export default interface ITransformation {
    type: TransformationEnum;
    configuration?: {
        groupIdentityFields: string[],
        groupFieldName: string,
        interval: number
    };
}
