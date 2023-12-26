import axios from "axios"

import { Address } from "../../key"
import { IP } from "../../types"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/did/${Address.from(contract).toString()}`

const delegateUri = (delegateIP: string | IP) => `${IP.from(delegateIP).toString()}?uri=`

async function getIssuer(api: string | IP, contract: string | Address, delegateIP: string | IP) {
    const apiPath = `${url(api, contract)}/service`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getCredential(
    api: string | IP, 
    contract: string | Address,
    templateID: string,
    credentialID: string,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/template/${templateID}/credential/${credentialID}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getTemplate(
    api: string | IP,
    contract: string | Address,
    templateID: string,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/template/${templateID}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getCredentials(
    api: string | IP,
    contract: string | Address,
    templateID: string,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/template/${templateID}/credentials`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getCredentialByHolder(
    api: string | IP,
    contract: string | Address,
    holder: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/holder/${Address.from(holder).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getIssuer,
    getCredential,
    getTemplate,
    getCredentials,
    getCredentialByHolder,
}