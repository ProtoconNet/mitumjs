import { Address } from "../../key";
import { IP } from "../../types";
declare function getService(api: string | IP, contract: string | Address): Promise<import("axios").AxiosResponse<any, any>>;
declare function getPartitions(api: string | IP, contract: string | Address, holder: string | Address): Promise<import("axios").AxiosResponse<any, any>>;
declare function getBalanceByHolder(api: string | IP, contract: string | Address, holder: string | Address, partition: string): Promise<import("axios").AxiosResponse<any, any>>;
declare function getOperatorsByHolder(api: string | IP, contract: string | Address, holder: string | Address, partition: string): Promise<import("axios").AxiosResponse<any, any>>;
declare function getPartitionBalance(api: string | IP, contract: string | Address, partition: string): Promise<import("axios").AxiosResponse<any, any>>;
declare function getAuthorized(api: string | IP, contract: string | Address, operator: string | Address): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getService: typeof getService;
    getPartitions: typeof getPartitions;
    getBalanceByHolder: typeof getBalanceByHolder;
    getOperatorsByHolder: typeof getOperatorsByHolder;
    getPartitionBalance: typeof getPartitionBalance;
    getAuthorized: typeof getAuthorized;
};
export default _default;
