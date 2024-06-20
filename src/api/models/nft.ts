import axios from "axios"

import { Address } from "../../key"
import { Big, IP } from "../../types"
import { delegateUri, apiPathWithHashParams } from "../../utils"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/nft/${Address.from(contract).toString()}`

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
    factHash?: string,
    limit?: number, offset?: number, reverse?: true
) {
    const apiPath = apiPathWithHashParams(`${url(api, contract)}/nfts`, factHash, limit, offset, reverse);
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

async function getModel(
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
    getModel,
    getAccountOperators,
}