import axios from "axios"
import { Address } from "../../key"
import { delegateUri } from "../../utils"

const url = (
    api: string | undefined, 
    contract: string | Address, 
) => `${api}/payment/${Address.from(contract).toString()}`


async function getModel(
    api: string | undefined,
    contract: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getAccountInfo(
    api: string | undefined,
    contract: string | Address,
    address: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/account/${Address.from(address).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getAccountInfo,
    getModel,
}