import { CreateSecurityTokenFact } from "./create-security-token";
import { IssueSecurityTokenFact } from "./issue-sercurity-token";
import { AuthorizeOperatorFact } from "./authorize-operator";
import { RevokeOperatorFact } from "./revoke-operator";
import { RedeemTokenFact } from "./redeem-token";
import { SetDocumentFact } from "./set-document";
import { TransferSecurityTokenPartitionFact } from "./transfer-security-token-partition";
import { Partition } from "./partition";
import { ContractGenerator, Operation } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { Big, IP } from "../../types";
type createServiceData = {
    granularity: string | number | Big;
    defaultPartition: string | Partition;
};
export declare class STO extends ContractGenerator {
    constructor(networkID: string, api?: string | IP);
    authorizeOperator(contractAddr: string | Address, sender: string | Address, operator: string | Address, partition: string | Partition, currency: string | CurrencyID): Operation<AuthorizeOperatorFact>;
    createService(contractAddr: string | Address, sender: string | Address, data: createServiceData, currency: string | CurrencyID): Operation<CreateSecurityTokenFact>;
    issue(contractAddr: string | Address, sender: string | Address, receiver: string | Address, partition: string | Partition, amount: string | number | Big, currency: string | CurrencyID): Operation<IssueSecurityTokenFact>;
    redeem(contractAddr: string | Address, sender: string | Address, tokenHolder: string | Address, partition: string | Partition, amount: string | number | Big, currency: string | CurrencyID): Operation<RedeemTokenFact>;
    revokeOperator(contractAddr: string | Address, sender: string | Address, operator: string | Address, partition: string | Partition, currency: string | CurrencyID): Operation<RevokeOperatorFact>;
    setDocument(contractAddr: string | Address, sender: string | Address, title: string, uri: string, documentHash: string, currency: string | CurrencyID): Operation<SetDocumentFact>;
    transferByPartition(contractAddr: string | Address, sender: string | Address, holder: string | Address, receiver: string | Address, partition: string | Partition, amount: string | number | Big, currency: string | CurrencyID): Operation<TransferSecurityTokenPartitionFact>;
    getServiceInfo(contractAddr: string | Address): Promise<any>;
    getPartitionsInfo(contractAddr: string | Address, holder: string | Address): Promise<any>;
    getBalanceByHolder(contractAddr: string | Address, holder: string | Address, partition: string): Promise<any>;
    getOperatorsByHolder(contractAddr: string | Address, holder: string | Address, partition: string): Promise<any>;
    getPartitionBalanceInfo(contractAddr: string | Address, partition: string): Promise<any>;
    getAuthorizedInfo(contractAddr: string | Address, operator: string | Address): Promise<any>;
}
export {};
