import { IP } from "../../types";
import { CurrencyID } from "../../common";
declare function getCurrencies(api: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getCurrency(api: string | IP, currency: string | CurrencyID): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getCurrencies: typeof getCurrencies;
    getCurrency: typeof getCurrency;
};
export default _default;
