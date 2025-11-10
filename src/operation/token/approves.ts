import { Buffer } from "buffer";
import { TokenItem } from "./item"
import { OperationFact } from "../base"

import { Big, HintedObject } from "../../types"
import { HINT } from "../../alias"
import { Address } from "../../key/address"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class ApprovesItem extends TokenItem {
    readonly approved: Address

    constructor(
        contract: string | Address,
        approved: string | Address,
        amount: string | number | Big, 
        currency: string | CurrencyID,
    ) {
        super(HINT.TOKEN.APPROVES.ITEM, contract, amount, currency);

        this.approved = Address.from(approved);
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            this.amount.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            approved: this.approved.toString(),
            amount: this.amount.toString(),
            currency: this.currency.toString(),
        }
    }

    toString(): string {
        return `${super.toString()}-${this.approved.toString()}`
    }
}

export class ApprovesFact extends OperationFact<ApprovesItem> {
    constructor(token: string, sender: string | Address, items: ApprovesItem[]) {
        super(HINT.TOKEN.APPROVES.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicated approve found in items")
        )

        this.items.forEach(
            it => {
                Assert.check(
                    this.sender.toString() != it.contract.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"),
                )
                Assert.check(
                    it.approved.toString() != it.contract.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "approved is same with contract address"),
                )
                Assert.check(
                    it.amount.compare(0) >= 0,
                    MitumError.detail(ECODE.INVALID_FACT, "amount must not be under zero"),
                )
            }
        )
    }

    get operationHint() {
        return HINT.TOKEN.APPROVES.OPERATION
    }
}