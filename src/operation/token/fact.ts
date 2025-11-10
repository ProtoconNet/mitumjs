import { Buffer } from "buffer";
import { ContractFact } from "../base"
import type { FactJson } from "../base"
import { Address } from "../../key/address"
import { CurrencyID } from "../../common"

export abstract class TokenFact extends ContractFact {
    protected constructor(
        hint: string,
        token: string,
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
    ) {
        super(hint, token, sender, contract, currency)
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