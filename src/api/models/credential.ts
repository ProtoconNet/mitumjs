import axios from "axios"
import { Address } from "../../key"
import { delegateUri } from "../../utils"

const url = (
    api: string | undefined, 
    contract: string | Address, 
) => `${api}/did/${Address.from(contract).toString()}`

async function getModel(api: string | undefined, contract: string | Address, delegateIP: string | undefined) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getCredential(
    api: string | undefined, 
    contract: string | Address,
    templateID: string,
    credentialID: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/template/${templateID}/credential/${credentialID}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getTemplate(
    api: string | undefined,
    contract: string | Address,
    templateID: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/template/${templateID}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getCredentials(
    api: string | undefined,
    contract: string | Address,
    templateID: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/template/${templateID}/credentials`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getCredentialByHolder(
    api: string | undefined,
    contract: string | Address,
    holder: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/holder/${Address.from(holder).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getModel,
    getCredential,
    getTemplate,
    getCredentials,
    getCredentialByHolder,
}