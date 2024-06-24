import { CurrencyPolicy } from "./currency-design"
import { FactJson, NodeFact } from "../base"

import { HINT } from "../../alias"
import { CurrencyID } from "../../common"
import { Big } from "../../types"

export class UpdateCurrencyFact extends NodeFact {
    readonly currency: CurrencyID
    readonly policy: CurrencyPolicy
    readonly decimal: Big

    constructor(token: string, currency: string | CurrencyID, decimal: string | number | Big, policy: CurrencyPolicy) {
        super(HINT.CURRENCY.UPDATE_CURRENCY.FACT, token)
        this.currency = CurrencyID.from(currency)
        this.policy = policy
        this.decimal = Big.from(decimal)
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
            this.decimal.toBuffer(),
            this.policy.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            currency: this.currency.toString(),
            decimal: this.decimal.v,
            policy: this.policy.toHintedObject(),
        }
    }

    get operationHint() {
        return HINT.CURRENCY.UPDATE_CURRENCY.OPERATION
    }
}