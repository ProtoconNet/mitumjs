import { Operation as OP, Fact, UserOperation } from "../operation/base"

import { ErrorResponse, SuccessResponse, HintedObject } from "../types" 

export const isOpFact = (operation: any): operation is OP<Fact> => {
    return operation instanceof OP;
}
export const isHintedObject = (object: any): object is HintedObject => {
    return '_hint' in object && 'fact' in object && 'hash' in object;
}

export const isUserOp = (userOperation: any): userOperation is UserOperation<Fact> => {
    return userOperation instanceof UserOperation;
}

export const isHintedObjectFromUserOp = (object: any): object is HintedObject => {
    if (
        '_hint' in object &&
        'fact' in object &&
        'hash' in object &&
        'authentication' in object &&
        'settlement' in object
    ) {
        const { authentication, settlement } = object;
        return (
            'contract' in authentication &&
            'authentication_id' in authentication &&
            'proof_data' in authentication &&
            'op_sender' in settlement &&
            'proxy_payer' in settlement
        );
    }
    return false;
};

export const isErrorResponse = (response: ErrorResponse | SuccessResponse): response is ErrorResponse => {
    return 'error_code' in response;
}

export const isSuccessResponse = (response: ErrorResponse | SuccessResponse): response is SuccessResponse => {
    return 'data' in response;
}

export const isBase58Encoded = (value: string): boolean => {
    if (!value || typeof value !== 'string') {
        return false;
    }
    const base58Chars = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
    return base58Chars.test(value);
}