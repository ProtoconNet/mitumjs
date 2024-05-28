import { NFTItem } from "./item"
import { OperationFact } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class DelegateItem extends NFTItem {
    readonly operator: Address
    readonly mode: "allow" | "cancel"

    constructor(
        contract: string | Address, 
        operator: string | Address, 
        mode: "allow" | "cancel",
        currency: string | CurrencyID,
    ) {
        super(HINT.NFT.DELEGATE.ITEM, contract, currency)

        this.operator = Address.from(operator)
        this.mode = mode
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.operator.toBuffer(),
            Buffer.from(this.mode),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            delegatee: this.operator.toString(),
            mode: this.mode,
        }
    }

    toString(): string {
        return `${super.toString()}-${this.operator.toString()}`
    }
}

export class DelegateFact extends OperationFact<DelegateItem> {
    constructor(token: string, sender: string | Address, items: DelegateItem[]) {
        super(HINT.NFT.DELEGATE.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate operator found in items")
        )

        this.items.forEach(
            it => {
                Assert.check(
                    this.sender.toString() != it.contract.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"),
                )
                Assert.check(
                    it.operator.toString() != it.contract.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "operator is same with contract address"),
                )
                Assert.check(
                    this.sender.toString() != it.operator.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with operator address"),
                )
            }
        )
    }

    get operationHint() {
        return HINT.NFT.DELEGATE.OPERATION
    }
}