import { FactJson } from "../base"
import { StorageFact } from "./fact"

import { LongString } from "../../types"
import { HINT } from "../../alias"
import { Config } from "../../node"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class DeleteDataFact extends StorageFact {
    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        dataKey: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(HINT.STORAGE.DELETE_DATA.FACT, token, sender, contract, dataKey, currency)

        Assert.check(
            Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length),
            MitumError.detail(ECODE.INVALID_FACT, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`),
        )
        
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
        return HINT.STORAGE.DELETE_DATA.OPERATION
    }
}