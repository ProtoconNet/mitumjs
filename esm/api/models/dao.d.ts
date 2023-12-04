import { Address } from "../../key";
import { IP } from "../../types";
declare function getService(api: string | IP, contract: string | Address): Promise<import("axios").AxiosResponse<any, any>>;
declare function getProposal(api: string | IP, contract: string | Address, proposalID: string): Promise<import("axios").AxiosResponse<any, any>>;
declare function getDelegator(api: string | IP, contract: string | Address, proposalID: string, delegator: string | Address): Promise<import("axios").AxiosResponse<any, any>>;
declare function getVoter(api: string | IP, contract: string | Address, proposalID: string): Promise<import("axios").AxiosResponse<any, any>>;
declare function getVotingResult(api: string | IP, contract: string | Address, proposalID: string): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getService: typeof getService;
    getProposal: typeof getProposal;
    getDelegator: typeof getDelegator;
    getVoter: typeof getVoter;
    getVotingResult: typeof getVotingResult;
};
export default _default;
