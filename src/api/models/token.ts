import axios from "axios"
import { Address } from "../../key/address"
import { delegateUri } from "../../utils"

const url = (
    api: string | undefined, 
    contract: string | Address, 
) => `${api}/token/${Address.from(contract).toString()}`

async function getModel(
    api: string | undefined,
    contract: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getTokenBalance(
    api: string | undefined,
    contract: string | Address,
    account: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/account/${Address.from(account).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getModel,
    getTokenBalance,
}