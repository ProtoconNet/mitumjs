import { ContractFact, FactJson } from "../base"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { LongString } from "../../types"
import { Config } from "../../node"
import { Assert, ECODE, MitumError } from "../../error"

export class CreateDidFact extends ContractFact {
    readonly publicKey: LongString
    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        publicKey: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(HINT.DID.CREATE_DID.FACT, token, sender, contract, currency)
        this.publicKey = LongString.from(publicKey)

        Assert.check(/^[0-9a-fA-F]+$/.test(publicKey.toString().slice(-128)), MitumError.detail(ECODE.INVALID_FACT, `${this.publicKey.toString()} is not a hexadecimal number`))
        Assert.check(Config.DID.PUBLIC_KEY.satisfy(publicKey.toString().length),
            MitumError.detail(ECODE.INVALID_FACT, `publickey length out of range, should be over ${Config.DID.PUBLIC_KEY.min}`),
        )

        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.publicKey.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            publicKey:  this.publicKey.toString(),
        }
    }

    get operationHint() {
        return HINT.DID.CREATE_DID.OPERATION
    }
}