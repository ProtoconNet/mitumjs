import axios from "axios"

import { Address } from "../../key"
import { IP } from "../../types"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/sto/${Address.from(contract).toString()}`

async function getService(
    api: string | IP, 
    contract: string | Address,
) {
    return await axios.get(`${url(api, contract)}`)
}

async function getPartitions(
    api: string | IP, 
    contract: string | Address,
    holder: string | Address,
) {
    return await axios.get(`${url(api, contract)}/holder/${Address.from(holder).toString()}/partitions`)
}

async function getBalanceByHolder(
    api: string | IP, 
    contract: string | Address,
    holder: string | Address,
    partition: string,
) {
    return await axios.get(`${url(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/balance`)
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