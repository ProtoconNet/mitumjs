import { Buffer } from "buffer";
import { HINT } from "../../alias"
import type { Address } from "../../key/address"
import { LongString } from "../../types"
import type { CurrencyID } from "../../common"
import { ContractFact, FactJson } from "../base"
import { Config } from "../../node"
import { Assert, ECODE, MitumError } from "../../error"

export class RegisterModelFact extends ContractFact {
    readonly project: LongString
    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address,
        project: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(HINT.STORAGE.REGISTER_MODEL.FACT, token, sender, contract, currency)
        
        Assert.check(
            Config.STORAGE.PROJECT.satisfy(project.toString().length),
            MitumError.detail(ECODE.INVALID_FACT, `project length out of range, should be between ${Config.STORAGE.PROJECT.min} to ${Config.STORAGE.PROJECT.max}`),
        )

        this.project = LongString.from(project)
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.project.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            project:  this.project.toString(),
        }
    }

    get operationHint() {
        return HINT.STORAGE.REGISTER_MODEL.OPERATION
    }
}