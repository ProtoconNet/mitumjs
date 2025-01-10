import { ECODE, MitumError } from "../error"

export const delegateUri = (delegateIP: string) => `${delegateIP}?uri=`

const validatePositiveInteger = (val: any, name: string) => {
    if (!Number.isSafeInteger(val) || val < 0) {
        throw MitumError.detail(ECODE.INVALID_FLOAT, `${name} must be a integer >= 0`)
    }
}

const isNumberTuple = (arr: any): arr is [number, number] => {
    return Array.isArray(arr) && arr.length === 2 && typeof arr[0] === 'number' && typeof arr[1] === 'number';
}

export const apiPathWithParams = (apiPath: string, limit?: number, offset?: number, reverse?: true) => {
    let query1: any; let query2: any; let query3: any;
    if (limit !== undefined) {
        validatePositiveInteger(limit, "limit");
        query1 = `limit=${limit}`;
    }
    if (offset !== undefined) {
        validatePositiveInteger(offset, "offset");
        query2 = `offset=${offset}`;
    }
    if (reverse !== undefined) {
        if (reverse !== true) {
            throw MitumError.detail(ECODE.INVALID_TYPE, "reverse must be true(bool)");
        }
        query3 = `reverse=1`;
    }
    const query = [query1, query2, query3].filter(str => str !== undefined).join("&");
    return query == "" ? apiPath : apiPath + "?" + query
}

export const apiPathWithHashParams = (apiPath: string, factHash?:string, limit?: number, offset?: number, reverse?: true) => {
    let hash: any; let query1: any; let query2: any; let query3: any;

    if (factHash !== undefined) {
        if (typeof(factHash) !== "string") {
            throw MitumError.detail(ECODE.INVALID_TYPE, "factHash must be a string");
        }
        hash = `facthash=${factHash}`;
    }
    if (limit !== undefined) {
        validatePositiveInteger(limit, "limit");
        query1 = `limit=${limit}`;
    }
    if (offset !== undefined) {
        validatePositiveInteger(offset, "offset");
        query2 = `offset=${offset}`;
    }
    if (reverse !== undefined) {
        if (reverse !== true) {
            throw MitumError.detail(ECODE.INVALID_TYPE, "reverse must be true(bool)");
        }
        query3 = `reverse=1`;
    }
    const query = [hash, query1, query2, query3].filter(str => str !== undefined).join("&");
    return query == "" ? apiPath : apiPath + "?" + query
}

export const apiPathWithParamsExt = (apiPath: string, limit?: number, offset?: [number,number], reverse?: true) => {
    let query1: any; let query2: any; let query3: any;
    if (limit !== undefined) {
        validatePositiveInteger(limit, "limit");
        query1 = `limit=${limit}`;
    }
    if (offset !== undefined) {
        if (!isNumberTuple(offset)) {
            throw MitumError.detail(ECODE.INVALID_TYPE, "offset must be a tuple with number");
        }

        validatePositiveInteger(offset[0], "offset element");
        validatePositiveInteger(offset[1], "offset element");
        query2 = `offset=${offset[0]},${offset[1]}`;
    }
    if (reverse !== undefined) {
        if (reverse !== true) {
            throw MitumError.detail(ECODE.INVALID_TYPE, "reverse must be true(bool)");
        }
        query3 = `reverse=1`;
    }
    const query = [query1, query2, query3].filter(str => str !== undefined).join("&");
    return query == "" ? apiPath : apiPath + "?" + query
}