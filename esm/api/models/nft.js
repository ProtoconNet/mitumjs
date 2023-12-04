import axios from "axios";
import { Address } from "../../key";
import { IP } from "../../types";
const url = (api, contract) => `${IP.from(api).toString()}/nft/${Address.from(contract).toString()}`;
async function getNFT(api, contract, nftID) {
    return await axios.get(`${url(api, contract)}/${nftID}`);
}
async function getNFTs(api, contract) {
    return await axios.get(`${url(api, contract)}/nfts`);
}
async function getCollection(api, contract) {
    return await axios.get(`${url(api, contract)}/collection`);
}
async function getAccountOperators(api, contract, account) {
    return await axios.get(`${url(api, contract)}/account/${Address.from(account).toString()}/operators`);
}
export default {
    getNFT,
    getNFTs,
    getCollection,
    getAccountOperators,
};
//# sourceMappingURL=nft.js.map