import { ContractFact, FactJson } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"

export abstract class TimeStampFact extends ContractFact {
    protected constructor(
        hint: string,
        token: string,
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
    ) {
        super(hint, token, sender, contract, currency)
        // this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
        }
    }
}