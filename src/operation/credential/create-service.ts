import { HINT } from "../../alias"
import { Address } from "../../key"
import { ContractFact } from "../base"
import { CurrencyID } from "../../common"

export class CreateServiceFact extends ContractFact {
    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address, 
        currency: string | CurrencyID,
    ) {
        super(HINT.CREDENTIAL.CREATE_SERVICE.FACT, token, sender, contract, currency)
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    get operationHint() {
        return HINT.CREDENTIAL.CREATE_SERVICE.OPERATION
    }
}