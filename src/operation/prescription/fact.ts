import { ContractFact, FactJson } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { LongString } from "../../types"

export abstract class PrescriptionFact extends ContractFact {
    readonly prescriptionHash: LongString
    protected constructor(
        hint: string,
        token: string,
        sender: string | Address,
        contract: string | Address,
        prescriptionHash: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(hint, token, sender, contract, currency)
        this.prescriptionHash = LongString.from(prescriptionHash)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.prescriptionHash.toBuffer()
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            prescription_hash:  this.prescriptionHash.toString(),
        }
    }
}