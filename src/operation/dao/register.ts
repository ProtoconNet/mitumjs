import { DAOFact } from "./fact"
import { FactJson } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class RegisterFact extends DAOFact {
    readonly delegated: Address

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        proposalID: string,
        delegated: string | Address,
        currency: string | CurrencyID,
    ) {
        super(HINT.DAO.REGISTER.FACT, token, sender, contract, proposalID, currency)
        
        this.delegated = Address.from(delegated)

        Assert.check(
            this.contract.toString() !== this.delegated.toString(),
            MitumError.detail(ECODE.INVALID_FACT, "contract is same with delegated address")
        )
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.delegated.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            delegated: this.delegated.toString(),
        }
    }

    get operationHint() {
        return HINT.DAO.REGISTER.OPERATION
    }
}