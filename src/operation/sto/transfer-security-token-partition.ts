import { STOItem } from "./item"
import { Partition } from "./partition"
import { OperationFact } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Big, HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class TransferSecurityTokenPartitionItem extends STOItem {
    readonly tokenHolder: Address
    readonly receiver: Address
    readonly partition: Partition
    readonly amount: Big

    constructor(
        contract: string | Address, 
        tokenHolder: string | Address,
        receiver: string | Address,
        partition: string | Partition,
        amount: string | number | Big,
        currency: string | CurrencyID,
    ) {
        super(HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.ITEM, contract, currency)

        this.tokenHolder = Address.from(tokenHolder)
        this.receiver = Address.from(receiver)
        this.partition = Partition.from(partition)
        this.amount  = Big.from(amount)

        Assert.check(
            this.contract.toString() !== this.tokenHolder.toString(),
            MitumError.detail(ECODE.INVALID_ITEM, "contract is same with token holder address")
        )

        Assert.check(
            this.contract.toString() !== this.receiver.toString(),
            MitumError.detail(ECODE.INVALID_ITEM, "contract is same with receiver address")
        )

        Assert.check(
            this.tokenHolder.toString() !== this.receiver.toString(),
            MitumError.detail(ECODE.INVALID_ITEM, "token holder is same with receiver address")
        )

        Assert.check(
            !this.amount.isZero(),
            MitumError.detail(ECODE.INVALID_ITEM, "zero amount"),    
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.tokenHolder.toBuffer(),
            this.receiver.toBuffer(),
            this.partition.toBuffer(),
            this.amount.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            tokenholder: this.tokenHolder.toString(),
            receiver: this.receiver.toString(),
            partition: this.partition.toString(),
            amount: this.amount.toString(),
        }
    }

    toString(): string {
        return `${this.tokenHolder.toString()}-${this.receiver.toString()}-${this.partition.toString()}`
    }
}

export class TransferSecurityTokenPartitionFact extends OperationFact<TransferSecurityTokenPartitionItem> {
    constructor(token: string, sender: string | Address, items: TransferSecurityTokenPartitionItem[]) {
        super(HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate token holder-receiver-partition found in items")
        )
    }

    get operationHint() {
        return HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.OPERATION
    }
}