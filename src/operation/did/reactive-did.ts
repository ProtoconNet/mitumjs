import { FactJson } from "../base"
import { DidFact } from "./fact"

import { LongString } from "../../types"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"

export class ReactivateDidFact extends DidFact {
    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        did: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(HINT.DID.REACTIVATE_DID.FACT, token, sender, contract, did, currency)
        this._hash = this.hashing()
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

    get operationHint() {
        return HINT.DID.REACTIVATE_DID.OPERATION
    }
}