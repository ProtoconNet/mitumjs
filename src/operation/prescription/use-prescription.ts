import { FactJson } from "../base"
import { PrescriptionFact } from "./fact"

import { Big, LongString } from "../../types"
import { HINT } from "../../alias"
import { Config } from "../../node"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class UsePrescriptionFact extends PrescriptionFact {
    readonly prepareDate: Big
    readonly pharmacy: LongString

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        prescriptionHash: string | LongString,
        prepareDate: string | number | Big,
        pharmacy: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(HINT.PRESCRIPTION.USE_PRESCRIPTION.FACT, token, sender, contract, prescriptionHash, currency);
        this.prepareDate = Big.from(prepareDate);
        this.pharmacy = LongString.from(pharmacy);

        Assert.check(
            Config.PRESCRIPTION.PHARMACY.satisfy(pharmacy.toString().length),
            MitumError.detail(ECODE.INVALID_FACT, `pharmacy name out of range, should be between ${Config.PRESCRIPTION.PHARMACY.min} to ${Config.PRESCRIPTION.PHARMACY.max}`),
        )
        
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.prepareDate.toBuffer("fill"),
            this.pharmacy.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            prepare_date: this.prepareDate.v,
            pharmacy: this.pharmacy.toString(),
        }
    }

    get operationHint() {
        return HINT.PRESCRIPTION.USE_PRESCRIPTION.OPERATION
    }
}