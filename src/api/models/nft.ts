import axios from "axios"

import { Address } from "../../key"
import { Big, IP } from "../../types"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/nft/${Address.from(contract).toString()}`

const delegateUri = (delegateIP: string | IP) => `${IP.from(delegateIP).toString()}?uri=`

async function getNFT(
    api: string | IP,
    contract: string | Address,
    nftID: string | number | Big,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/${nftID}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getNFTs(
    api: string | IP,
    contract: string | Address,
    delegateIP: string | IP,
    factHash: string | undefined,
) {
    const apiPath = !factHash ? `${url(api, contract)}/nfts` : `${url(api, contract)}/nfts?facthash=${factHash}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getNFTCount(
    api: string | IP,
    contract: string | Address,
    delegateIP: string | IP,
) {
    const apiPath = `${url(api, contract)}/count`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getCollection(
    api: string | IP,
    contract: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/collection`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getAccountOperators(
    api: string | IP,
    contract: string | Address,
    account: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/account/${Address.from(account).toString()}/operators`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getNFT,
    getNFTs,
    getNFTCount,
    getCollection,
    getAccountOperators,
}