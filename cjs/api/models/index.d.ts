declare const _default: {
    currency: {
        getCurrencies: (api: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        getCurrency: (api: string | import("../../types").IP, currency: string | import("../../common").CurrencyID) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    contract: {
        nft: {
            getNFT: (api: string | import("../../types").IP, contract: string | import("../../key").Address, nftID: string | number | import("../../types").Big) => Promise<import("axios").AxiosResponse<any, any>>;
            getNFTs: (api: string | import("../../types").IP, contract: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
            getCollection: (api: string | import("../../types").IP, contract: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
            getAccountOperators: (api: string | import("../../types").IP, contract: string | import("../../key").Address, account: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        credential: {
            getIssuer: (api: string | import("../../types").IP, contract: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
            getCredential: (api: string | import("../../types").IP, contract: string | import("../../key").Address, templateID: string, credentialID: string) => Promise<import("axios").AxiosResponse<any, any>>;
            getTemplate: (api: string | import("../../types").IP, contract: string | import("../../key").Address, templateID: string) => Promise<import("axios").AxiosResponse<any, any>>;
            getCredentials: (api: string | import("../../types").IP, contract: string | import("../../key").Address, templateID: string) => Promise<import("axios").AxiosResponse<any, any>>;
            getCredentialByHolder: (api: string | import("../../types").IP, contract: string | import("../../key").Address, holder: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        dao: {
            getService: (api: string | import("../../types").IP, contract: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
            getProposal: (api: string | import("../../types").IP, contract: string | import("../../key").Address, proposalID: string) => Promise<import("axios").AxiosResponse<any, any>>;
            getDelegator: (api: string | import("../../types").IP, contract: string | import("../../key").Address, proposalID: string, delegator: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
            getVoter: (api: string | import("../../types").IP, contract: string | import("../../key").Address, proposalID: string) => Promise<import("axios").AxiosResponse<any, any>>;
            getVotingResult: (api: string | import("../../types").IP, contract: string | import("../../key").Address, proposalID: string) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        kyc: {};
        sto: {
            getService: (api: string | import("../../types").IP, contract: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
            getPartitions: (api: string | import("../../types").IP, contract: string | import("../../key").Address, holder: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
            getBalanceByHolder: (api: string | import("../../types").IP, contract: string | import("../../key").Address, holder: string | import("../../key").Address, partition: string) => Promise<import("axios").AxiosResponse<any, any>>;
            getOperatorsByHolder: (api: string | import("../../types").IP, contract: string | import("../../key").Address, holder: string | import("../../key").Address, partition: string) => Promise<import("axios").AxiosResponse<any, any>>;
            getPartitionBalance: (api: string | import("../../types").IP, contract: string | import("../../key").Address, partition: string) => Promise<import("axios").AxiosResponse<any, any>>;
            getAuthorized: (api: string | import("../../types").IP, contract: string | import("../../key").Address, operator: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        timestamp: {
            getService: (api: string | import("../../types").IP, contract: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
            getTimeStamp: (api: string | import("../../types").IP, contract: string | import("../../key").Address, projectID: string, tid: string | number | import("../../types").Big) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        token: {
            getToken: (api: string | import("../../types").IP, contract: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
            getTokenBalance: (api: string | import("../../types").IP, contract: string | import("../../key").Address, account: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        point: {
            getPoint: (api: string | import("../../types").IP, contract: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
            getPointBalance: (api: string | import("../../types").IP, contract: string | import("../../key").Address, account: string | import("../../key").Address) => Promise<import("axios").AxiosResponse<any, any>>;
        };
    };
};
export default _default;
