import type { BaseOperation } from "../operation/base/operation"
import type { Fact } from "../operation/base/fact"
import { ErrorResponse, SuccessResponse, HintedObject } from "../types" 

export const isOpFact = (operation: any): operation is BaseOperation<Fact> => {
    if (typeof operation !== "object" || operation === null) return false;
  
    const hasRequiredProps =
      "id" in operation &&
      "hint" in operation &&
      "fact" in operation &&
      "_factSigns" in operation &&
      "_hash" in operation;
  
    if (!hasRequiredProps) return false;
  
    const isIdValid = typeof operation.id === "string";
    const isHintValid =
      typeof operation.hint === "object" &&
      operation.hint !== null &&
      "_hint" in operation.hint;
  
    const isFactValid =
      typeof operation.fact === "object" &&
      operation.fact !== null &&
      "operationHint" in operation.fact;
  
    const isFactSignsValid = Array.isArray(operation._factSigns);
    const isHashValid =
      operation._hash instanceof Uint8Array ||
      (typeof Buffer !== "undefined" && Buffer.isBuffer?.(operation._hash));
  
    return (
      isIdValid &&
      isHintValid &&
      isFactValid &&
      isFactSignsValid &&
      isHashValid
    );
};

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