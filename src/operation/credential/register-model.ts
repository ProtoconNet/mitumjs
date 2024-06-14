import { HINT } from "../../alias"
import { Address } from "../../key"
import { ContractFact } from "../base"
import { CurrencyID } from "../../common"

export class RegisterModelFact extends ContractFact {
    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address, 
        currency: string | CurrencyID,
    ) {
        super(HINT.CREDENTIAL.REGISTER_MODEL.FACT, token, sender, contract, currency)
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    get operationHint() {
        return HINT.CREDENTIAL.REGISTER_MODEL.OPERATION
    }
}