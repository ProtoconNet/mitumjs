import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { ContractFact, FactJson } from "../base"

export class RegisterModelFact extends ContractFact {
    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address,
        currency: string | CurrencyID,
    ) {
        super(HINT.PRESCRIPTION.REGISTER_MODEL.FACT, token, sender, contract, currency);
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
        return HINT.PRESCRIPTION.REGISTER_MODEL.OPERATION
    }
}