import { AxiosResponse } from "axios"

import account from "./account"
import block from "./block"
import node from "./node"
import operation from "./operation"
import models from "./models"

import { SuccessResponse, ErrorResponse } from "../types"
import { assignCodeFromErrorMessage } from "../error"

const currency = models.currency
const contractApi = models.contract

export {
    account,
    block,
    node,
    operation,
    currency,
    contractApi,
}

export default {
    account,
    block,
    node,
    operation,
    currency,
    contractApi,
}

export async function getAPIData(f: () => Promise<AxiosResponse>, _links? : boolean): Promise<SuccessResponse | ErrorResponse> {
    try {
        const res = await f();
        const parsedResponse: SuccessResponse = {
            status: res.status,
            method: res.config.method,
            url: res.config.url,
            request_body: res.config.data,
            data: _links ? { _embedded: res.data._embedded, _links: res.data._links } : res.data._embedded,
        };
        return parsedResponse;

    } catch (error: any) {
        if (error.response) {
            const { response } = error;
            const parsedError: ErrorResponse = {
                status: response.status,
                method: response.config.method,
                url: response.config.url,
                error_code: response.data ? assignCodeFromErrorMessage(response.data) : {pcode:[], dcode:[]},
                request_body: response.config.data,
                error_message: response.data,
            };
            return parsedError;
        } else if (error.code) {
            const parsedError: ErrorResponse = {
                status: 500,
                method: error.config.method,
                url: error.config.url,
                error_code: {pcode:[], dcode:[]},
                request_body: error.config.data,
                error_message: error.code,
            };
            return parsedError;
        } else {
            throw new Error(`Unknown error orccur!\n${error}`);
        }
    }
}