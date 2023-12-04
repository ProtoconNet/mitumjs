import axios from "axios";
import { Address } from "../../key";
import { IP } from "../../types";
const url = (api, contract) => `${IP.from(api).toString()}/did/${Address.from(contract).toString()}`;
async function getIssuer(api, contract) {
    return await axios.get(`${url(api, contract)}/service`);
}
async function getCredential(api, contract, templateID, credentialID) {
    return await axios.get(`${url(api, contract)}/template/${templateID}/credential/${credentialID}`);
}
async function getTemplate(api, contract, templateID) {
    return await axios.get(`${url(api, contract)}/template/${templateID}`);
}
async function getCredentials(api, contract, templateID) {
    return await axios.get(`${url(api, contract)}/template/${templateID}/credentials`);
}
async function getCredentialByHolder(api, contract, holder) {
    return await axios.get(`${url(api, contract)}/holder/${Address.from(holder).toString()}`);
}
export default {
    getIssuer,
    getCredential,
    getTemplate,
    getCredentials,
    getCredentialByHolder,
};
//# sourceMappingURL=credential.js.map