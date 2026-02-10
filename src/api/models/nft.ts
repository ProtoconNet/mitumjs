import axios from "axios"
import { Address } from "../../key/address"
import { Big } from "../../types"
import { delegateUri, apiPathWithHashParams } from "../../utils"

const url = (
    api: string | undefined, 
    contract: string | Address, 
) => `${api}/nft/${Address.from(contract).toString()}`

async function getNFT(
    api: string | undefined,
    contract: string | Address,
    nftIdx: string | number | Big,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/nftidx/${nftIdx}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getNFTs(
    api: string | undefined,
    contract: string | Address,
    delegateIP: string | undefined,
    factHash?: string,
    limit?: number, offset?: number, reverse?: true
) {
    const apiPath = apiPathWithHashParams(`${url(api, contract)}/nfts`, factHash, limit, offset, reverse);
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getModel(
    api: string | undefined,
    contract: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getAccountOperators(
    api: string | undefined,
    contract: string | Address,
    account: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/account/${Address.from(account).toString()}/allapproved`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getNFT,
    getNFTs,
    getModel,
    getAccountOperators,
}