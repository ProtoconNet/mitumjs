import { Operation as OP, Fact } from "../operation/base"
import { ErrorResponse, SuccessResponse } from "../types" 

export const isOpFact = (operation: any): operation is OP<Fact> => {
    return operation instanceof OP;
}

export const isErrorResponse = (response: ErrorResponse | SuccessResponse): response is ErrorResponse => {
    return 'error_code' in response;
}

export const isSuccessResponse = (response: ErrorResponse | SuccessResponse): response is SuccessResponse => {
    return 'data' in response;
}