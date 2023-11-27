import { CreateSecurityTokenItem, CreateSecurityTokenFact } from "./create-security-token"
import { IssueSecurityTokenItem, IssueSecurityTokenFact } from "./issue-sercurity-token"
import { AuthorizeOperatorItem, AuthorizeOperatorFact } from "./authorize-operator"
import { RevokeOperatorItem, RevokeOperatorFact } from "./revoke-operator"
import { RedeemTokenItem, RedeemTokenFact } from "./redeem-token"
import { SetDocumentFact } from "./set-document"
import { TransferSecurityTokenPartitionItem, TransferSecurityTokenPartitionFact } from "./transfer-security-token-partition"
import { contract, getAPIData } from "../../api"
import { Partition } from "./partition"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Big, IP, TimeStamp } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

type createServiceData = {
    granularity: string | number | Big
    defaultPartition: string | Partition
}

export class STO extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }

    authorizeOperator(
        contractAddr: string | Address,
        sender: string | Address,
        operator: string | Address,
        partition: string | Partition,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new AuthorizeOperatorFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new AuthorizeOperatorItem(
                        contractAddr,
                        operator,
                        partition,
                        currency,
                    )
                ]
            )
        )
    }

    createService(
        contractAddr: string | Address,
        sender: string | Address,
        data: createServiceData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof createServiceData)[] = ['granularity', 'defaultPartition'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createServiceData structure`))
        });
        return new Operation(
            this.networkID,
            new CreateSecurityTokenFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateSecurityTokenItem(
                        contractAddr,
                        data.granularity,
                        data.defaultPartition,
                        currency,
                    )
                ]
            ),
        )
    }

    issue(
        contractAddr: string | Address,
        sender: string | Address,
        receiver: string | Address,
        partition: string | Partition,
        amount: string | number | Big,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new IssueSecurityTokenFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new IssueSecurityTokenItem(
                        contractAddr,
                        receiver,
                        amount,
                        partition,
                        currency,
                    )
                ]
            )
        )
    }

    redeem(
        contractAddr: string | Address,
        sender: string | Address,
        tokenHolder: string | Address,
        partition: string | Partition,
        amount: string | number | Big,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RedeemTokenFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new RedeemTokenItem(
                        contractAddr,
                        tokenHolder,
                        amount,
                        partition,
                        currency,
                    )
                ]
            )
        )
    }

    revokeOperator(
        contractAddr: string | Address,
        sender: string | Address,
        operator: string | Address,
        partition: string | Partition,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RevokeOperatorFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new RevokeOperatorItem(
                        contractAddr,
                        operator,
                        partition,
                        currency,
                    )
                ]
            )
        )
    }

    setDocument(
        contractAddr: string | Address,
        sender: string | Address,
        title: string,
        uri: string,
        documentHash: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new SetDocumentFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                title,
                uri,
                documentHash,
                currency,
            )
        )
    }

    transferByPartition(
        contractAddr: string | Address,
        sender: string | Address,
        holder: string | Address,
        receiver: string | Address,
        partition: string | Partition,
        amount: string | number | Big,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new TransferSecurityTokenPartitionFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new TransferSecurityTokenPartitionItem(
                        contractAddr,
                        holder,
                        receiver,
                        partition,
                        amount,
                        currency,
                    )
                ]
            )
        )
    }

    async getServiceInfo(contractAddr: string | Address) {
        return await getAPIData(() => contract.sto.getService(this.api, contractAddr))
    }

    async getPartitionsInfo(contractAddr: string | Address, holder: string | Address) {
        return await getAPIData(() => contract.sto.getPartitions(this.api, contractAddr, holder))
    }
    
    async getBalanceByHolder(contractAddr: string | Address, holder: string | Address, partition: string) {
        return await getAPIData(() => contract.sto.getBalanceByHolder(this.api, contractAddr, holder, partition))
    }

    async getOperatorsByHolder(contractAddr: string | Address, holder: string | Address, partition: string) {
        return await getAPIData(() => contract.sto.getOperatorsByHolder(this.api, contractAddr, holder, partition))
    }

    async getPartitionBalanceInfo(contractAddr: string | Address, partition: string) {
        return await getAPIData(() => contract.sto.getPartitionBalance(this.api, contractAddr, partition))
    }
    
    async getAuthorizedInfo(contractAddr: string | Address, operator: string | Address) {
        return await getAPIData(() => contract.sto.getAuthorized(this.api, contractAddr, operator))
    }
}