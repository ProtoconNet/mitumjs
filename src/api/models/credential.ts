import axios from "axios"

import { Address } from "../../key"
import { IP } from "../../types"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/did/${Address.from(contract).toString()}`

async function getIssuer(api: string | IP, contract: string | Address) {
    return await axios.get(`${url(api, contract)}/service`)
}

async function getCredential(
    api: string | IP, 
    contract: string | Address,
    templateID: string,
    credentialID: string,
) {
    return await axios.get(
        `${url(api, contract)}/template/${templateID}/credential/${credentialID}`
    )
}

async function getTemplate(
    api: string | IP,
    contract: string | Address,
    templateID: string,
) {
    return await axios.get(`${url(api, contract)}/template/${templateID}`)
}

async function getCredentials(
    api: string | IP,
    contract: string | Address,
    templateID: string,
) {
    return await axios.get(`${url(api, contract)}/template/${templateID}/credentials`)
}

async function getCredentialByHolder(
    api: string | IP,
    contract: string | Address,
    holder: string | Address,
) {
    return await axios.get(`${url(api, contract)}/holder/${Address.from(holder).toString()}`)
}

export default {
    getIssuer,
    getCredential,
    getTemplate,
    getCredentials,
    getCredentialByHolder,
}