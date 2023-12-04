import axios from "axios";
import { Address } from "../../key";
import { IP } from "../../types";
const url = (api, contract) => `${IP.from(api).toString()}/token/${Address.from(contract).toString()}`;
async function getToken(api, contract) {
    return await axios.get(`${url(api, contract)}`);
}
async function getTokenBalance(api, contract, account) {
    return await axios.get(`${url(api, contract)}/account/${Address.from(account).toString()}`);
}
export default {
    getToken,
    getTokenBalance,
};
//# sourceMappingURL=token.js.map