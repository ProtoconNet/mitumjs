import axios from "axios"
import { Address } from "../../key"
import { delegateUri } from "../../utils"

const url = (
    api: string | undefined, 
    contract: string | Address,
) => `${api}/prescription/${Address.from(contract).toString()}`

async function getModel(
    api: string | undefined, 
    contract: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getPrescription(
    api: string | undefined, 
    contract: string | Address,
    hash: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/hash/${hash}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getModel,
    getPrescription,
}