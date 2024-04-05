import axios from "axios"

import { Address } from "../../key"
import { IP } from "../../types"
import { delegateUri } from "../../utils/apiPathUtils"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/sto/${Address.from(contract).toString()}`

async function getService(
    api: string | IP, 
    contract: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getPartitions(
    api: string | IP, 
    contract: string | Address,
    holder: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/holder/${Address.from(holder).toString()}/partitions`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getBalanceByHolder(
    api: string | IP, 
    contract: string | Address,
    holder: string | Address,
    partition: string,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/balance`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getOperatorsByHolder(
    api: string | IP, 
    contract: string | Address,
    holder: string | Address,
    partition: string,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/operators`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getPartitionBalance(
    api: string | IP, 
    contract: string | Address,
    partition: string,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/partition/${partition}/balance`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getAuthorized(
    api: string | IP, 
    contract: string | Address,
    operator: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/operator/${Address.from(operator).toString()}/holders`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getService,
    getPartitions,
    getBalanceByHolder,
    getOperatorsByHolder,
    getPartitionBalance,
    getAuthorized,
}