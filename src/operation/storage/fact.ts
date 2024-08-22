import { ContractFact, FactJson } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { LongString } from "../../types"

export abstract class StorageFact extends ContractFact {
    readonly dataKey: LongString
    protected constructor(
        hint: string,
        token: string,
        sender: string | Address,
        contract: string | Address,
        dataKey: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(hint, token, sender, contract, currency)
        this.dataKey = LongString.from(dataKey)

        // Assert.check(
        //     this.decimal.compare(0) >= 0,
        //     MitumError.detail(ECODE.INVALID_FACT, "decimal number under zero"),
        // )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.dataKey.toBuffer()
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            dataKey:  this.dataKey.toString(),
        }
    }
}