import { STOItem } from "./item"
import { Partition } from "./partition"
import { OperationFact } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Big, HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class RedeemItem extends STOItem {
    readonly tokenHolder: Address
    readonly amount: Big
    readonly partition: Partition

    constructor(
        contract: string | Address, 
        tokenHolder: string | Address,
        amount: string | number | Big,
        partition: string | Partition,
        currency: string | CurrencyID,
    ) {
        super(HINT.STO.REDEEM.ITEM, contract, currency)

        this.tokenHolder = Address.from(tokenHolder)
        this.amount  = Big.from(amount)
        this.partition = Partition.from(partition)

        Assert.check(
            this.contract.toString() !== this.tokenHolder.toString(),
            MitumError.detail(ECODE.INVALID_ITEM, "tokenHolder is same with contract address")
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
            this.amount.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            tokenHolder: this.tokenHolder.toString(),
            amount: this.amount.toString(),
            partition: this.partition.toString(),
        }
    }

    toString(): string {
        return this.tokenHolder.toString()
    }
}

export class RedeemFact extends OperationFact<RedeemItem> {
    constructor(token: string, sender: string | Address, items: RedeemItem[]) {
        super(HINT.STO.REDEEM.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate token holder found in items")
        )

        items.forEach(
            item => {
                Assert.check(
                    item.contract.toString() !== sender.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")
                )
            }
        )
    }

    get operationHint() {
        return HINT.STO.REDEEM.OPERATION
    }
}