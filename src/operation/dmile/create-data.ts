import { ContractFact, FactJson } from "../base"
import { LongString } from "../../types"
import { HINT } from "../../alias"
import { Config } from "../../node"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class CreateDataFact extends ContractFact {
    readonly merkleRoot: LongString
    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        merkleRoot: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(HINT.DMILE.CREATE_DATA.FACT, token, sender, contract, currency)
        this.merkleRoot = LongString.from(merkleRoot)

        Assert.check(
            Config.DMILE.MERKLE_ROOT.satisfy(merkleRoot.toString().length),
            MitumError.detail(ECODE.INVALID_LENGTH, `merkleRoot length must be ${Config.DMILE.MERKLE_ROOT.min}`),
        )
        
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.merkleRoot.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            merkle_root: this.merkleRoot.toString(),
        }
    }

    get operationHint() {
        return HINT.DMILE.CREATE_DATA.OPERATION
    }
}