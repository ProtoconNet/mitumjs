import { HINT } from "../../alias"
import { Address } from "../../key"
import { LongString } from "../../types"
import { CurrencyID } from "../../common"
import { ContractFact, FactJson } from "../base"
// import { Config } from "../../node"
// import { Assert, ECODE, MitumError } from "../../error"


export class RegisterModelFact extends ContractFact {
    readonly didMethod: LongString

    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address,
        didMethod: string,
        currency: string | CurrencyID,
    ) {
        super(HINT.AUTH_DID.REGISTER_MODEL.FACT, token, sender, contract, currency)
        
        // Assert.check(
        //     Config.DMILE.PROJECT.satisfy(project.toString().length),
        //     MitumError.detail(ECODE.INVALID_FACT, `project length out of range, should be between ${Config.DMILE.PROJECT.min} to ${Config.DMILE.PROJECT.max}`),
        // )

        this.didMethod = LongString.from(didMethod)
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.didMethod.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            didMethod: this.didMethod.toString(),
        }
    }

    get operationHint() {
        return HINT.AUTH_DID.REGISTER_MODEL.OPERATION
    }
}

