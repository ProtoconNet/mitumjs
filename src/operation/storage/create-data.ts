import { FactJson } from "../base"
import { StorageFact } from "./fact"

import { LongString } from "../../types"
import { HINT } from "../../alias"
import { Config } from "../../node"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class CreateDataFact extends StorageFact {
    readonly dataValue: LongString
    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        dataKey: string | LongString,
        dataValue: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(HINT.STORAGE.CREATE_DATA.FACT, token, sender, contract, dataKey, currency)
        this.dataValue = LongString.from(dataValue)

        Assert.check(
            Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length),
            MitumError.detail(ECODE.INVALID_FACT, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`),
        )
        Assert.check(
            Config.STORAGE.DATA_VALUE.satisfy(dataValue.toString().length),
            MitumError.detail(ECODE.INVALID_FACT, `dataValue out of range, should be between ${Config.STORAGE.DATA_VALUE.min} to ${Config.STORAGE.DATA_VALUE.max}`),
        )
        
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.dataValue.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            dataValue: this.dataValue.toString(),
        }
    }

    get operationHint() {
        return HINT.STORAGE.CREATE_DATA.OPERATION
    }
}