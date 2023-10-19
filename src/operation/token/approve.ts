import { TokenFact } from "./fact"

import { Big } from "../../types"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"
import { FactJson } from "../base"

export class ApproveFact extends TokenFact {
    readonly approved: Address
    readonly amount: Big

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
        approved: string | Address,
        amount: string | number | Big,
    ) {
        super(HINT.TOKEN.APPROVE.FACT, token, sender, contract, currency)

        this.approved = Address.from(approved)
        this.amount = Big.from(amount)

        Assert.check(
            this.contract.toString() !== this.approved.toString(),
            MitumError.detail(ECODE.INVALID_FACT, "contract is same with approved address")
        )

        Assert.check(
            this.amount.compare(0) > 0,
            MitumError.detail(ECODE.INVALID_FACT, "zero amount"),
        )
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            this.amount.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            approved:  this.approved.toString(),
            amount: this.amount.toString(),
        }
    }

    get operationHint() {
        return HINT.TOKEN.APPROVE.OPERATION
    }
}