import { TokenFact } from "./fact"
import { FactJson } from "../base"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Big, LongString } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class RegisterTokenFact extends TokenFact {
    readonly symbol: CurrencyID
    readonly name: LongString
    readonly totalSupply: Big

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
        symbol: string | CurrencyID,
        name: string | LongString,
        totalSupply: string | number | Big,
    ) {
        super(HINT.TOKEN.REGISTER_TOKEN.FACT, token, sender, contract, currency)
        this.symbol = CurrencyID.from(symbol)
        this.name = LongString.from(name)
        this.totalSupply = Big.from(totalSupply)

        Assert.check(
            this.totalSupply.compare(0) > 0,
            MitumError.detail(ECODE.INVALID_FACT, "totalSupply under zero"),
        )
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.symbol.toBuffer(),
            this.name.toBuffer(),
            this.totalSupply.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            symbol:  this.symbol.toString(),
            name: this.name.toString(),
            total_supply: this.totalSupply.toString(),
        }
    }

    get operationHint() {
        return HINT.TOKEN.REGISTER_TOKEN.OPERATION
    }
}