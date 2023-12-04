import axios from "axios";
import { Address } from "../../key";
import { IP } from "../../types";
const url = (api, contract) => `${IP.from(api).toString()}/point/${Address.from(contract).toString()}`;
async function getPoint(api, contract) {
    return await axios.get(`${url(api, contract)}`);
}
async function getPointBalance(api, contract, account) {
    return await axios.get(`${url(api, contract)}/account/${Address.from(account).toString()}`);
}
export default {
    getPoint,
    getPointBalance,
};
//# sourceMappingURL=point.js.map