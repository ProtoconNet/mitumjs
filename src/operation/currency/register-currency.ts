import { Buffer } from "buffer";
import { CurrencyDesign } from "./currency-design"
import { NodeFact, FactJson } from "../base"

import { HINT } from "../../alias"

export class RegisterCurrencyFact extends NodeFact {
    readonly design: CurrencyDesign

    constructor(token: string, design: CurrencyDesign) {
        super(HINT.CURRENCY.REGISTER_CURRENCY.FACT, token)
        this.design = design
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.token.toBuffer(),
            this.design.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            currency: this.design.toHintedObject(),
        }
    }

    get operationHint() {
        return HINT.CURRENCY.REGISTER_CURRENCY.OPERATION
    }
}