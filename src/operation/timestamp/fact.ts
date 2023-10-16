import { ContractFact, FactJson } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"

export abstract class TimeStampFact extends ContractFact {
    protected constructor(
        hint: string,
        token: string,
        sender: string | Address,
        target: string | Address,
        currency: string | CurrencyID,
    ) {
        super(hint, token, sender, target, currency)
        // this._hash = this.hashing()
    }

    toHintedObject(): FactJson {
        const fact = super.toHintedObject()
        delete fact['contract']

        return {
            ...fact,
            target: this.contract.toString(),
        }
    }
}