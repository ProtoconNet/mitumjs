import { AxiosResponse } from "axios";
import account from "./account";
import block from "./block";
import node from "./node";
import operation from "./operation";
declare const currency: {
    getCurrencies: (api: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    getCurrency: (api: string | import("../types").IP, currency: string | import("../common").CurrencyID) => Promise<AxiosResponse<any, any>>;
};
declare const contract: {
    nft: {
        getNFT: (api: string | import("../types").IP, contract: string | import("../key").Address, nftID: string | number | import("../types").Big) => Promise<AxiosResponse<any, any>>;
        getNFTs: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        getCollection: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        getAccountOperators: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
    };
    credential: {
        getIssuer: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        getCredential: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string, credentialID: string) => Promise<AxiosResponse<any, any>>;
        getTemplate: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string) => Promise<AxiosResponse<any, any>>;
        getCredentials: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string) => Promise<AxiosResponse<any, any>>;
        getCredentialByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
    };
    dao: {
        getService: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        getProposal: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string) => Promise<AxiosResponse<any, any>>;
        getDelegator: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string, delegator: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        getVoter: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string) => Promise<AxiosResponse<any, any>>;
        getVotingResult: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string) => Promise<AxiosResponse<any, any>>;
    };
    kyc: {};
    sto: {
        getService: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        getPartitions: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        getBalanceByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, partition: string) => Promise<AxiosResponse<any, any>>;
        getOperatorsByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, partition: string) => Promise<AxiosResponse<any, any>>;
        getPartitionBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, partition: string) => Promise<AxiosResponse<any, any>>;
        getAuthorized: (api: string | import("../types").IP, contract: string | import("../key").Address, operator: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
    };
    timestamp: {
        getService: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        getTimeStamp: (api: string | import("../types").IP, contract: string | import("../key").Address, projectID: string, tid: string | number | import("../types").Big) => Promise<AxiosResponse<any, any>>;
    };
    token: {
        getToken: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        getTokenBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
    };
    point: {
        getPoint: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        getPointBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
    };
};
export { account, block, node, operation, currency, contract, };
declare const _default: {
    account: {
        getAccount: (api: string | import("../types").IP, address: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        getAccountByPublicKey: (api: string | import("../types").IP, publicKey: string | import("../key").Key) => Promise<AxiosResponse<any, any>>;
    };
    block: {
        getBlocks: (api: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getBlockByHeight: (api: string | import("../types").IP, height: string | number | import("../types").Big) => Promise<AxiosResponse<any, any>>;
        getBlockByHash: (api: string | import("../types").IP, hash: string) => Promise<AxiosResponse<any, any>>;
    };
    node: {
        getNode: (api: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
    operation: {
        getOperations: (api: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getOperation: (api: string | import("../types").IP, hash: string) => Promise<AxiosResponse<any, any>>;
        getBlockOperationsByHeight: (api: string | import("../types").IP, height: string | number | import("../types").Big) => Promise<AxiosResponse<any, any>>;
        getBlockOperationsByHash: (api: string | import("../types").IP, hash: string) => Promise<AxiosResponse<any, any>>;
        getAccountOperations: (api: string | import("../types").IP, address: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        send: (api: string | import("../types").IP, operation: string | import("../types").HintedObject, config?: {
            [i: string]: any;
        } | undefined) => Promise<AxiosResponse<any, any>>;
    };
    currency: {
        getCurrencies: (api: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getCurrency: (api: string | import("../types").IP, currency: string | import("../common").CurrencyID) => Promise<AxiosResponse<any, any>>;
    };
    contract: {
        nft: {
            getNFT: (api: string | import("../types").IP, contract: string | import("../key").Address, nftID: string | number | import("../types").Big) => Promise<AxiosResponse<any, any>>;
            getNFTs: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
            getCollection: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
            getAccountOperators: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        };
        credential: {
            getIssuer: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
            getCredential: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string, credentialID: string) => Promise<AxiosResponse<any, any>>;
            getTemplate: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string) => Promise<AxiosResponse<any, any>>;
            getCredentials: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string) => Promise<AxiosResponse<any, any>>;
            getCredentialByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        };
        dao: {
            getService: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
            getProposal: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string) => Promise<AxiosResponse<any, any>>;
            getDelegator: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string, delegator: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
            getVoter: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string) => Promise<AxiosResponse<any, any>>;
            getVotingResult: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string) => Promise<AxiosResponse<any, any>>;
        };
        kyc: {};
        sto: {
            getService: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
            getPartitions: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
            getBalanceByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, partition: string) => Promise<AxiosResponse<any, any>>;
            getOperatorsByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, partition: string) => Promise<AxiosResponse<any, any>>;
            getPartitionBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, partition: string) => Promise<AxiosResponse<any, any>>;
            getAuthorized: (api: string | import("../types").IP, contract: string | import("../key").Address, operator: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        };
        timestamp: {
            getService: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
            getTimeStamp: (api: string | import("../types").IP, contract: string | import("../key").Address, projectID: string, tid: string | number | import("../types").Big) => Promise<AxiosResponse<any, any>>;
        };
        token: {
            getToken: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
            getTokenBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        };
        point: {
            getPoint: (api: string | import("../types").IP, contract: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
            getPointBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address) => Promise<AxiosResponse<any, any>>;
        };
    };
};
export default _default;
export declare function getAPIData(f: () => Promise<AxiosResponse>): Promise<any>;
