import { FactJson } from "../base"
import { PrescriptionFact } from "./fact"

import { Big, LongString } from "../../types"
import { HINT } from "../../alias"
import { Config } from "../../node"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class RegisterPrescriptionFact extends PrescriptionFact {
    readonly prescribeDate: Big
    readonly endDate: Big
    readonly hospital: LongString

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        prescriptionHash: string | LongString,
        prescribeDate: string | number | Big,
        endDate: string | number | Big,
        hospital: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(HINT.PRESCRIPTION.REGISTER_PRESCRIPTION.FACT, token, sender, contract, prescriptionHash, currency);
        this.prescribeDate = Big.from(prescribeDate);
        this.endDate = Big.from(endDate);
        this.hospital = LongString.from(hospital);

        Assert.check(
            Config.PRESCRIPTION.HASH.satisfy(prescriptionHash.toString().length),
            MitumError.detail(ECODE.INVALID_FACT, `prescription hash out of range, should be between ${Config.PRESCRIPTION.HASH.min} to ${Config.PRESCRIPTION.HASH.max}`),
        )
        Assert.check(
            Config.PRESCRIPTION.HOSPITAL.satisfy(hospital.toString().length),
            MitumError.detail(ECODE.INVALID_FACT, `hospital name out of range, should be between ${Config.PRESCRIPTION.HOSPITAL.min} to ${Config.PRESCRIPTION.HOSPITAL.max}`),
        )
        
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.prescribeDate.toBuffer("fill"),
            this.endDate.toBuffer("fill"),
            this.hospital.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            prescribe_date: this.prescribeDate.v,
            end_date: this.endDate.v,
            hospital: this.hospital.toString(),
        }
    }

    get operationHint() {
        return HINT.PRESCRIPTION.REGISTER_PRESCRIPTION.OPERATION
    }
}