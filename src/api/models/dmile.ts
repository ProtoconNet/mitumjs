import axios from "axios"
import { Address } from "../../key"
import { delegateUri } from "../../utils"

const url = (
    api: string | undefined, 
    contract: string | Address,
) => `${api}/dmile/${Address.from(contract).toString()}`

async function getModel(
    api: string | undefined, 
    contract: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getByMerkleRoot(
    api: string | undefined, 
    contract: string | Address,
    merkleRoot: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/merkleroot/${merkleRoot}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getByTxHash(
    api: string | undefined, 
    contract: string | Address,
    txId: string,
    delegateIP: string | undefined,
) {
    const apiPath = `${url(api, contract)}/txhash/${txId}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getModel,
    getByMerkleRoot,
    getByTxHash
}