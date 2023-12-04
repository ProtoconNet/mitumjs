import { Address } from "../../key";
import { IP } from "../../types";
declare function getPoint(api: string | IP, contract: string | Address): Promise<import("axios").AxiosResponse<any, any>>;
declare function getPointBalance(api: string | IP, contract: string | Address, account: string | Address): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getPoint: typeof getPoint;
    getPointBalance: typeof getPointBalance;
};
export default _default;
