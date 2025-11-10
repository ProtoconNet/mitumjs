import { Buffer } from "buffer";
import { PaymentFact } from "./fact"

import { HINT } from "../../alias"
import { Address } from "../../key/address"
import { CurrencyID } from "../../common"


export class WithdrawFact extends PaymentFact {
    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address, 
        currency: string | CurrencyID,
    ) {
        super(HINT.PAYMENT.WITHDRAW.FACT, token, sender, contract, currency)
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    get operationHint() {
        return HINT.PAYMENT.WITHDRAW.OPERATION
    }
}