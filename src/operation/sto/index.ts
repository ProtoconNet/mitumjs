import { CreateSecurityTokenItem, CreateSecurityTokenFact } from "./create-security-token"
import { IssueSecurityTokenItem, IssueSecurityTokenFact } from "./issue-sercurity-token"
import { AuthorizeOperatorItem, AuthorizeOperatorFact } from "./authorize-operator"
import { RevokeOperatorItem, RevokeOperatorFact } from "./revoke-operator"
import { RedeemTokenItem, RedeemTokenFact } from "./redeem-token"
import { SetDocumentFact } from "./set-document"
import { TransferSecurityTokenPartitionItem, TransferSecurityTokenPartitionFact } from "./transfer-security-token-partition"

import { Partition } from "./partition"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Big, IP, TimeStamp } from "../../types"

type data = {
    granularity: string | number | Big
    defaultPartition: string | Partition
    controllers: (string | Address)[]
}

export class STO extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }

    authorizeOperator(
        contractAdd: string | Address,
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
                        contractAdd,
                        operator,
                        partition,
                        currency,
                    )
                ]
            )
        )
    }

    createService(
        contractAdd: string | Address,
        sender: string | Address,
        data: data,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new CreateSecurityTokenFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateSecurityTokenItem(
                        contractAdd,
                        data.granularity,
                        data.defaultPartition,
                        data.controllers,
                        currency,
                    )
                ]
            ),
        )
    }

    issue(
        contractAdd: string | Address,
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
                        contractAdd,
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
        contractAdd: string | Address,
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
                        contractAdd,
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
        contractAdd: string | Address,
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
                        contractAdd,
                        operator,
                        partition,
                        currency,
                    )
                ]
            )
        )
    }

    setDocument(
        contractAdd: string | Address,
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
                contractAdd,
                title,
                uri,
                documentHash,
                currency,
            )
        )
    }

    transferByPartition(
        contractAdd: string | Address,
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
                        contractAdd,
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
}