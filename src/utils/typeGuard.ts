import { Operation as OP, Fact } from "../operation/base"
import { ErrorResponse, SuccessResponse, HintedObject } from "../types" 

export const isOpFact = (operation: any): operation is OP<Fact> => {
    return operation instanceof OP;
}
export const isHintedObject = (object: any): object is HintedObject => {
    return '_hint' in object && 'fact' in object && 'hash' in object;
}

export const isErrorResponse = (response: ErrorResponse | SuccessResponse): response is ErrorResponse => {
    return 'error_code' in response;
}

export const isSuccessResponse = (response: ErrorResponse | SuccessResponse): response is SuccessResponse => {
    return 'data' in response;
}