import { CreateSecurityTokenItem, CreateSecurityTokenFact } from "./create-security-token";
import { IssueSecurityTokenItem, IssueSecurityTokenFact } from "./issue-sercurity-token";
import { AuthorizeOperatorItem, AuthorizeOperatorFact } from "./authorize-operator";
import { RevokeOperatorItem, RevokeOperatorFact } from "./revoke-operator";
import { RedeemTokenItem, RedeemTokenFact } from "./redeem-token";
import { SetDocumentFact } from "./set-document";
import { TransferSecurityTokenPartitionItem, TransferSecurityTokenPartitionFact } from "./transfer-security-token-partition";
import { contract, getAPIData } from "../../api";
import { ContractGenerator, Operation } from "../base";
import { TimeStamp } from "../../types";
import { Assert, ECODE, MitumError } from "../../error";
export class STO extends ContractGenerator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    authorizeOperator(contractAddr, sender, operator, partition, currency) {
        return new Operation(this.networkID, new AuthorizeOperatorFact(TimeStamp.new().UTC(), sender, [
            new AuthorizeOperatorItem(contractAddr, operator, partition, currency)
        ]));
    }
    createService(contractAddr, sender, data, currency) {
        const keysToCheck = ['granularity', 'defaultPartition'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createServiceData structure`));
        });
        return new Operation(this.networkID, new CreateSecurityTokenFact(TimeStamp.new().UTC(), sender, [
            new CreateSecurityTokenItem(contractAddr, data.granularity, data.defaultPartition, currency)
        ]));
    }
    issue(contractAddr, sender, receiver, partition, amount, currency) {
        return new Operation(this.networkID, new IssueSecurityTokenFact(TimeStamp.new().UTC(), sender, [
            new IssueSecurityTokenItem(contractAddr, receiver, amount, partition, currency)
        ]));
    }
    redeem(contractAddr, sender, tokenHolder, partition, amount, currency) {
        return new Operation(this.networkID, new RedeemTokenFact(TimeStamp.new().UTC(), sender, [
            new RedeemTokenItem(contractAddr, tokenHolder, amount, partition, currency)
        ]));
    }
    revokeOperator(contractAddr, sender, operator, partition, currency) {
        return new Operation(this.networkID, new RevokeOperatorFact(TimeStamp.new().UTC(), sender, [
            new RevokeOperatorItem(contractAddr, operator, partition, currency)
        ]));
    }
    setDocument(contractAddr, sender, title, uri, documentHash, currency) {
        return new Operation(this.networkID, new SetDocumentFact(TimeStamp.new().UTC(), sender, contractAddr, title, uri, documentHash, currency));
    }
    transferByPartition(contractAddr, sender, holder, receiver, partition, amount, currency) {
        return new Operation(this.networkID, new TransferSecurityTokenPartitionFact(TimeStamp.new().UTC(), sender, [
            new TransferSecurityTokenPartitionItem(contractAddr, holder, receiver, partition, amount, currency)
        ]));
    }
    async getServiceInfo(contractAddr) {
        return await getAPIData(() => contract.sto.getService(this.api, contractAddr));
    }
    async getPartitionsInfo(contractAddr, holder) {
        return await getAPIData(() => contract.sto.getPartitions(this.api, contractAddr, holder));
    }
    async getBalanceByHolder(contractAddr, holder, partition) {
        return await getAPIData(() => contract.sto.getBalanceByHolder(this.api, contractAddr, holder, partition));
    }
    async getOperatorsByHolder(contractAddr, holder, partition) {
        return await getAPIData(() => contract.sto.getOperatorsByHolder(this.api, contractAddr, holder, partition));
    }
    async getPartitionBalanceInfo(contractAddr, partition) {
        return await getAPIData(() => contract.sto.getPartitionBalance(this.api, contractAddr, partition));
    }
    async getAuthorizedInfo(contractAddr, operator) {
        return await getAPIData(() => contract.sto.getAuthorized(this.api, contractAddr, operator));
    }
}
//# sourceMappingURL=index.js.map