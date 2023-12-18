import axios from "axios"

import { Address } from "../../key"
import { IP } from "../../types"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/sto/${Address.from(contract).toString()}`

const delegateAddress = "http://localhost:5598/v1/mitumt/delegate/call?uri="

async function getService(
    api: string | IP, 
    contract: string | Address,
    delegate?: boolean | undefined,
) {
    const apiPath = `${url(api, contract)}`;
    const encodedString = encodeURIComponent(apiPath);
    return !delegate ? await axios.get(apiPath) : await axios.get(delegateAddress + encodedString) 
}

async function getPartitions(
    api: string | IP, 
    contract: string | Address,
    holder: string | Address,
    delegate? : boolean | undefined,
) {
    const apiPath = `${url(api, contract)}/holder/${Address.from(holder).toString()}/partitions`;
    const encodedString = encodeURIComponent(apiPath);
    return !delegate ? await axios.get(apiPath) : await axios.get(delegateAddress + encodedString) 
}

async function getBalanceByHolder(
    api: string | IP, 
    contract: string | Address,
    holder: string | Address,
    partition: string,
    delegate? : boolean | undefined,
) {
    const apiPath = `${url(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/balance`;
    const encodedString = encodeURIComponent(apiPath);
    return !delegate ? await axios.get(apiPath) : await axios.get(delegateAddress + encodedString) 
}

async function getOperatorsByHolder(
    api: string | IP, 
    contract: string | Address,
    holder: string | Address,
    partition: string,
) {
    return await axios.get(`${url(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/operators`)
}

async function getPartitionBalance(
    api: string | IP, 
    contract: string | Address,
    partition: string,
) {
    return await axios.get(`${url(api, contract)}/partition/${partition}/balance`)
}

async function getAuthorized(
    api: string | IP, 
    contract: string | Address,
    operator: string | Address,
) {
    return await axios.get(`${url(api, contract)}/operator/${Address.from(operator).toString()}/holders`)
}

export default {
    getService,
    getPartitions,
    getBalanceByHolder,
    getOperatorsByHolder,
    getPartitionBalance,
    getAuthorized,
}