import axios from "axios";
import { IP } from "../../types";
import { CurrencyID } from "../../common";
async function getCurrencies(api) {
    return await axios.get(`${IP.from(api).toString()}/currency`);
}
async function getCurrency(api, currency) {
    return await axios.get(`${IP.from(api).toString()}/currency/${CurrencyID.from(currency).toString()}`);
}
export default {
    getCurrencies,
    getCurrency,
};
//# sourceMappingURL=currency.js.map