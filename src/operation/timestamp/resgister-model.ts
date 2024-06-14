import { TimeStampFact } from "./fact"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"


export class RegisterModelFact extends TimeStampFact {
    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address, 
        currency: string | CurrencyID,
    ) {
        super(HINT.TIMESTAMP.REGISTER_MODEL.FACT, token, sender, contract, currency)
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
        ])
    }

    get operationHint() {
        return HINT.TIMESTAMP.REGISTER_MODEL.OPERATION
    }
}