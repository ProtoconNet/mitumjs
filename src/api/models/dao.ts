import axios from "axios"

import { Address } from "../../key"
import { IP } from "../../types"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/dao/${Address.from(contract).toString()}`

async function getService(
    api: string | IP, 
    contract: string | Address,
) {
    return await axios.get(`${url(api, contract)}/service`)
}

async function getProposal(
    api: string | IP, 
    contract: string | Address,
    proposalID: string,
) {
    return await axios.get(`${url(api, contract)}/proposal/${proposalID}`)
}

async function getDelegator(
    api: string | IP, 
    contract: string | Address,
    proposalID: string,
    delegator: string | Address,
) {
    return await axios.get(`${url(api, contract)}/proposal/${proposalID}/delegator/${Address.from(delegator).toString()}`)
}

async function getVoter(
    api: string | IP, 
    contract: string | Address,
    proposalID: string,
) {
    return await axios.get(`${url(api, contract)}/proposal/${proposalID}/voter`)
}

async function getVotingResult(
    api: string | IP, 
    contract: string | Address,
    proposalID: string,
) {
    return await axios.get(`${url(api, contract)}/proposal/${proposalID}/votingpower`)
}

export default {
    getService,
    getProposal,
    getDelegator,
    getVoter,
    getVotingResult,
}