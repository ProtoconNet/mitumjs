import { IP } from "../types";
import { Address, Key } from "../key";
declare function getAccount(api: string | IP, address: string | Address): Promise<import("axios").AxiosResponse<any, any>>;
declare function getAccountByPublicKey(api: string | IP, publicKey: string | Key): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getAccount: typeof getAccount;
    getAccountByPublicKey: typeof getAccountByPublicKey;
};
export default _default;
