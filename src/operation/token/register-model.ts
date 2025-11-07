import { TokenFact } from "./fact"
import type { FactJson } from "../base"
import { HINT } from "../../alias"
import { Address } from "../../key/address"
import { CurrencyID } from "../../common"
import { Big, LongString } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class RegisterModelFact extends TokenFact {
    readonly symbol: CurrencyID
    readonly name: LongString
    readonly decimal: Big
    readonly initialSupply: Big

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
        symbol: string | CurrencyID,
        name: string | LongString,
        decimal: string | number | Big,
        initialSupply: string | number | Big,
    ) {
        super(HINT.TOKEN.REGISTER_MODEL.FACT, token, sender, contract, currency)
        this.symbol = CurrencyID.from(symbol)
        this.name = LongString.from(name)
        this.decimal = Big.from(decimal)
        this.initialSupply = Big.from(initialSupply)

        Assert.check(
            this.initialSupply.compare(0) >= 0,
            MitumError.detail(ECODE.INVALID_FACT, "initialSupply under zero"),
        )

        Assert.check(
            this.decimal.compare(0) >= 0,
            MitumError.detail(ECODE.INVALID_FACT, "decimal number under zero"),
        )
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.symbol.toBuffer(),
            this.name.toBuffer(),
            this.decimal.toBuffer(),
            this.initialSupply.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            symbol:  this.symbol.toString(),
            name: this.name.toString(),
            decimal: this.decimal.toString(),
            initial_supply: this.initialSupply.toString(),
        }
    }

    get operationHint() {
        return HINT.TOKEN.REGISTER_MODEL.OPERATION
    }
}