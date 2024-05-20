import { Fact, FactJson } from "../base"

import { HINT } from "../../alias"
import { CurrencyID } from "../../common"
import { Address, Keys } from "../../key"

export class UpdateKeyFact extends Fact {
    readonly target: Address
    readonly keys: Keys
    readonly currency: CurrencyID

    constructor(token: string, target: string | Address, keys: Keys, currency: string | CurrencyID) {
        super(HINT.CURRENCY.UPDATE_KEY.FACT, token)
        this.target = Address.from(target)
        this.keys = keys
        this.currency = CurrencyID.from(currency)
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.target.toBuffer(),
            this.keys.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            target: this.target.toString(),
            keys: this.keys.toHintedObject(),
            currency: this.currency.toString(),
        }
    }

    get operationHint() {
        return HINT.CURRENCY.UPDATE_KEY.OPERATION
    }
}