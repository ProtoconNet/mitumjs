import { ContractFact, FactJson } from "../base"
import { LongString } from "../../types"
import { HINT } from "../../alias"
// import { Config } from "../../node"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
// import { Assert, ECODE, MitumError } from "../../error"

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

        // Assert.check(
        //     Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length),
        //     MitumError.detail(ECODE.INVALID_FACT, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`),
        // )
        
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
            merkleRoot: this.merkleRoot.toString(),
        }
    }

    get operationHint() {
        return HINT.DMILE.CREATE_DATA.OPERATION
    }
}