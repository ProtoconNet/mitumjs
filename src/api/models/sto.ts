import axios from "axios"
import { Address } from "../../key"
import { delegateUri } from "../../utils"

const url = (
    api: string | undefined, 
    contract: string | Address, 
) => `${api}/sto/${Address.from(contract).toString()}`

async function getService(
    api: string | undefined, 
    contract: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getPartitions(
    api: string | undefined, 
    contract: string | Address,
    holder: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/holder/${Address.from(holder).toString()}/partitions`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getBalanceByHolder(
    api: string | undefined, 
    contract: string | Address,
    holder: string | Address,
    partition: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/balance`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getOperatorsByHolder(
    api: string | undefined, 
    contract: string | Address,
    holder: string | Address,
    partition: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/operators`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getPartitionBalance(
    api: string | undefined, 
    contract: string | Address,
    partition: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/p
    artition/${partition}/balance`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getAuthorized(
    api: string | undefined, 
    contract: string | Address,
    operator: string | Address,
    delegateIP: string | undefined
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