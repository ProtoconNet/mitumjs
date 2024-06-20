import axios from "axios"

import { Address } from "../../key"
import { IP } from "../../types"
import { delegateUri } from "../../utils"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/dao/${Address.from(contract).toString()}`

async function getModel(
    api: string | IP, 
    contract: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/service`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getProposal(
    api: string | IP, 
    contract: string | Address,
    proposalID: string,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/proposal/${proposalID}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getApproved(
    api: string | IP, 
    contract: string | Address,
    proposalID: string,
    delegator: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/proposal/${proposalID}/delegator/${Address.from(delegator).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getVoters(
    api: string | IP, 
    contract: string | Address,
    proposalID: string,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/proposal/${proposalID}/voter`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getVotingStatus(
    api: string | IP, 
    contract: string | Address,
    proposalID: string,
    delegateIP: string | IP
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