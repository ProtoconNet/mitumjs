import { Buffer } from "buffer";
import { ContractFact, FactJson } from "../base"

import { Address } from "../../key/address"
import { CurrencyID } from "../../common"

export abstract class PaymentFact extends ContractFact {
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
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
        }
    }
}