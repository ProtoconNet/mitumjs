import axios from "axios";
import { IP } from "../types";
import { Address, Key } from "../key";
async function getAccount(api, address) {
    return await axios.get(`${IP.from(api).toString()}/account/${Address.from(address).toString()}`);
}
async function getAccountByPublicKey(api, publicKey) {
    return await axios.get(`${IP.from(api).toString()}/accounts?publickey=${Key.from(publicKey).toString()}`);
}
export default {
    getAccount,
    getAccountByPublicKey,
};
//# sourceMappingURL=account.js.map