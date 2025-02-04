import { Operation as OP, Fact } from "../operation/base"
import { ErrorResponse, SuccessResponse, HintedObject } from "../types" 

export const isOpFact = (operation: any): operation is OP<Fact> => {
    return operation instanceof OP;
}
export const isHintedObject = (object: any): object is HintedObject => {
    return '_hint' in object && 'fact' in object && 'hash' in object;
}

export const isHintedObjectFromUserOp = (object: any): object is HintedObject => {
    if (
        '_hint' in object &&
        'fact' in object &&
        'hash' in object &&
        'extension' in object
    ) {
        const { authentication, settlement, proxy_payer } = object.extension;
        return (
            '_hint' in authentication &&
            'contract' in authentication &&
            'authentication_id' in authentication &&
            'proof_data' in authentication &&
            '_hint' in settlement &&
            'op_sender' in settlement &&
            (proxy_payer ? '_hint' in proxy_payer && 'proxy_payer' in proxy_payer : true)
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