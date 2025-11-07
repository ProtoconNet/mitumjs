import axios from "axios"
import { Address } from "../key/address"
import { Big, HintedObject } from "../types"
import { delegateUri, apiPathWithParams, apiPathWithParamsExt } from "../utils"

async function getOperations(
    api: string | undefined,
    delegateIP: string | undefined,
    limit?: number, offset?: [number, number], reverse?: true
) {
    const apiPath = apiPathWithParamsExt(`${api}/block/operations`, limit, offset, reverse);
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getOperation(api: string | undefined, hash: string, delegateIP: string | undefined,) {
    const apiPath = `${api}/block/operation/${hash}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getMultiOperations(api: string | undefined, hashes: string[], delegateIP: string | undefined,) {
    const apiPath = `${api}/block/operations/facts?hashes=${ hashes.join(",")}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getBlockOperationsByHeight(
    api: string | undefined, 
    height: string | number | Big, 
    delegateIP: string | undefined,
    limit?: number, offset?: number, reverse?: true
) {
    const apiPath = apiPathWithParams(`${api}/block/${Big.from(height).toString()}/operations`, limit, offset, reverse);
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

// async function getBlockOperationsByHash(api: string | undefined, hash: string, delegateIP: string | undefined) {
//     const apiPath = `${api}/block/${hash}/operations`;
//     return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
// }

async function getAccountOperations(
    api: string | undefined,
    address: string | Address,
    delegateIP: string | undefined,
    limit?: number, offset?: [number, number], reverse?: true
) {
    const apiPath = apiPathWithParamsExt(`${api}/account/${Address.from(address).toString()}/operations`, limit, offset, reverse);
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function send(api: string | undefined, operation: HintedObject | string, delegateIP: string | undefined, config?: { [i: string]: any }) {
    const apiPath = `${api}/builder/send`;
    return !delegateIP 
    ? await axios.post(apiPath, JSON.stringify(operation), config) 
    : await axios.post(delegateIP.toString(), { ...Object(operation), uri: apiPath }, config)
}

export default {
    getOperations,
    getOperation,
    getBlockOperationsByHeight,
    getMultiOperations,
    getAccountOperations,
    send
}