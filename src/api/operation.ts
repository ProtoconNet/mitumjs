import axios from "axios"
import { Address } from "../key"
import { Big, HintedObject, IP } from "../types"

import { delegateUri, apiPathWithParams, apiPathWithParamsExt } from "../utils/apiPathUtils"

async function getOperations(
    api: string | IP, 
    delegateIP: string | IP,
    limit?: number, offset?: [number, number], reverse?: true
) {
    const apiPath = apiPathWithParamsExt(`${IP.from(api).toString()}/block/operations`, limit, offset, reverse);
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getOperation(api: string | IP, hash: string, delegateIP: string | IP) {
    const apiPath = `${IP.from(api).toString()}/block/operation/${hash}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getBlockOperationsByHeight(
    api: string | IP, 
    height: string | number | Big, 
    delegateIP: string | IP,
    limit?: number, offset?: number, reverse?: true
) {
    const apiPath = apiPathWithParams(`${IP.from(api).toString()}/block/${Big.from(height).toString()}/operations`, limit, offset, reverse);
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

// async function getBlockOperationsByHash(api: string | IP, hash: string, delegateIP: string | IP) {
//     const apiPath = `${IP.from(api).toString()}/block/${hash}/operations`;
//     return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
// }

async function getAccountOperations(
    api: string | IP,
    address: string | Address,
    delegateIP: string | IP,
    limit?: number, offset?: [number, number], reverse?: true
) {
    const apiPath = apiPathWithParamsExt(`${IP.from(api).toString()}/account/${Address.from(address).toString()}/operations`, limit, offset, reverse);
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function send(api: string | IP, operation: HintedObject | string, delegateIP: string | IP, config?: { [i: string]: any }) {
    const apiPath = `${IP.from(api).toString()}/builder/send`;
    return !delegateIP 
    ? await axios.post(apiPath, JSON.stringify(operation), config) 
    : await axios.post(delegateIP.toString(), { ...Object(operation), uri: apiPath }, config)
}

export default {
    getOperations,
    getOperation,
    getBlockOperationsByHeight,
    // getBlockOperationsByHash,
    getAccountOperations,
    send
}