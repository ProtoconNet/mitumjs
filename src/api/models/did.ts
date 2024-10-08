import axios from "axios"
import { Address } from "../../key"
import { delegateUri } from "../../utils"

const url = (
    api: string | undefined, 
    contract: string | Address,
) => `${api}/did-service/${Address.from(contract).toString()}`

async function getModel(
    api: string | undefined, 
    contract: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getByPubKey(
    api: string | undefined, 
    contract: string | Address,
    publicKey: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/did/${publicKey}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getByDID(
    api: string | undefined, 
    contract: string | Address,
    did: string,
    delegateIP: string | undefined,
) {
    const apiPath = `${url(api, contract)}/document?did=${did}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getModel,
    getByPubKey,
    getByDID
}