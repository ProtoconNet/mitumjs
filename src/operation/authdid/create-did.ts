import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { ContractFact, FactJson } from "../base"

export class CreateFact extends ContractFact {
    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address,
        currency: string | CurrencyID,
    ) {
        super(HINT.AUTH_DID.CREATE_DID.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
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
        return HINT.AUTH_DID.CREATE_DID.OPERATION
    }
}