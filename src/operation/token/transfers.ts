import { TokenItem } from "./item"
import { OperationFact } from "../base"

import { Big, HintedObject } from "../../types"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class TransfersItem extends TokenItem {
    readonly receiver: Address

    constructor(
        contract: string | Address,
        receiver: string | Address,
        amount: string | number | Big, 
        currency: string | CurrencyID,
    ) {
        super(HINT.TOKEN.TRANSFERS.ITEM, contract, amount, currency);

        this.receiver = Address.from(receiver);
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            amount: this.amount.toString(),
            currency: this.currency.toString(),
        }
    }

    toString(): string {
        return `${super.toString()}-${this.receiver.toString()}`
    }
}

export class TransfersFact extends OperationFact<TransfersItem> {
    constructor(token: string, sender: string | Address, items: TransfersItem[]) {
        super(HINT.TOKEN.TRANSFERS.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicated receiver found in items")
        )

        this.items.forEach(
            it => {
                Assert.check(
                    this.sender.toString() != it.contract.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"),
                )
                Assert.check(
                    it.receiver.toString() !== this.sender.toString(),
                    MitumError.detail(ECODE.INVALID_FACT, "receiver is same with sender address"),
                )
                Assert.check(
                    it.receiver.toString() != it.contract.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "receiver is same with contract address"),
                )
                Assert.check(
                    it.amount.compare(0) >= 0,
                    MitumError.detail(ECODE.INVALID_FACT, "amount must not be under zero"),
                )
            }
        )
    }

    get operationHint() {
        return HINT.TOKEN.TRANSFERS.OPERATION
    }
}