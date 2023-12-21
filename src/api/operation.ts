import axios from "axios"
import { Address } from "../key"
import { Big, HintedObject, IP } from "../types"

const delegateAddress = "http://{IP:PORT}/v1/mitumt/delegate/call?uri="

async function getOperations(api: string | IP) {
    return await axios.get(`${IP.from(api).toString()}/block/operations`)
}

async function getOperation(api: string | IP, hash: string, delegate?: boolean | undefined) {
    const apiPath = `${IP.from(api).toString()}/block/operation/${hash}`;
    const encodedString = encodeURIComponent(apiPath);
    return !delegate ? await axios.get(apiPath) : await axios.get(delegateAddress + encodedString) 
}

async function getBlockOperationsByHeight(api: string | IP, height: string | number | Big) {
    return await axios.get(`${IP.from(api).toString()}/block/${Big.from(height).toString()}/operations`)
}

async function getBlockOperationsByHash(api: string | IP, hash: string) {
    return await axios.get(`${IP.from(api).toString()}/block/${hash}/operations`)
}

async function getAccountOperations(api: string | IP, address: string | Address) {
    return await axios.get(`${IP.from(api).toString()}/account/${Address.from(address).toString()}/operations`)
}

async function send(api: string | IP, operation: HintedObject | string, config?: { [i: string]: any }) {
    return await axios.post(`${IP.from(api).toString()}/builder/send`, JSON.stringify(operation), config)
}

async function delegateSend(operation: HintedObject | string, config?: { [i: string]: any }) {
    const delegateAddress = "http://{IP:PORT}/v1/mitumt/delegate/call";
    return await axios.post(delegateAddress, operation, config)
}

export default {
    getOperations,
    getOperation,
    getBlockOperationsByHeight,
    getBlockOperationsByHash,
    getAccountOperations,
    send,
    delegateSend,
}