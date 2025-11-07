import axios from "axios"
import { Address } from "../../key/address"
import { delegateUri } from "../../utils"

const url = (
    api: string | undefined, 
    contract: string | Address, 
) => `${api}/dao/${Address.from(contract).toString()}`

async function getModel(
    api: string | undefined, 
    contract: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getProposal(
    api: string | undefined, 
    contract: string | Address,
    proposalID: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/proposal/${proposalID}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getApproved(
    api: string | undefined, 
    contract: string | Address,
    proposalID: string,
    registrant: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/proposal/${proposalID}/registrant/${Address.from(registrant).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getVoters(
    api: string | undefined, 
    contract: string | Address,
    proposalID: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/proposal/${proposalID}/voter`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getVotingStatus(
    api: string | undefined, 
    contract: string | Address,
    proposalID: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/proposal/${proposalID}/votingpower`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

export default {
    getModel,
    getProposal,
    getApproved,
    getVoters,
    getVotingStatus,
}