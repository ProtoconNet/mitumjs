import { Address } from "../../key";
import { Big, IP } from "../../types";
declare function getService(api: string | IP, contract: string | Address): Promise<import("axios").AxiosResponse<any, any>>;
declare function getTimeStamp(api: string | IP, contract: string | Address, projectID: string, tid: string | number | Big): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getService: typeof getService;
    getTimeStamp: typeof getTimeStamp;
};
export default _default;
