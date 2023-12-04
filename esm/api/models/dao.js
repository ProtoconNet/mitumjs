import axios from "axios";
import { Address } from "../../key";
import { IP } from "../../types";
const url = (api, contract) => `${IP.from(api).toString()}/dao/${Address.from(contract).toString()}`;
async function getService(api, contract) {
    return await axios.get(`${url(api, contract)}/service`);
}
async function getProposal(api, contract, proposalID) {
    return await axios.get(`${url(api, contract)}/proposal/${proposalID}`);
}
async function getDelegator(api, contract, proposalID, delegator) {
    return await axios.get(`${url(api, contract)}/proposal/${proposalID}/delegator/${Address.from(delegator).toString()}`);
}
async function getVoter(api, contract, proposalID) {
    return await axios.get(`${url(api, contract)}/proposal/${proposalID}/voter`);
}
async function getVotingResult(api, contract, proposalID) {
    return await axios.get(`${url(api, contract)}/proposal/${proposalID}/votingpower`);
}
export default {
    getService,
    getProposal,
    getDelegator,
    getVoter,
    getVotingResult,
};
//# sourceMappingURL=dao.js.map