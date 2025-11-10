import { Config } from "../node/config"
import type { IBuffer, IString } from "../types"
import { Assert, ECODE, MitumError } from "../error"
import { Buffer } from "buffer";

abstract class ID implements IBuffer, IString {
    private s: string

    constructor(s: string) {
        this.s = s
    }

    equal(id: ID): boolean {
        return this.toString() === id.toString()
    }

    toBuffer(): Buffer {
        return Buffer.from(this.s)
    }

    toString(): string {
        return this.s
    }
}

export class CurrencyID extends ID {
    constructor(s: string) {
        super(s)
        Assert.check(
            Config.CURRENCY_ID.satisfy(s.length),
            MitumError.detail(ECODE.INVALID_CURRENCY_ID, "currency id length out of range")
        )
        Assert.check(
            /^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s),
            MitumError.detail(ECODE.INVALID_CURRENCY_ID, "invalid currency id format"),
        )
    }

    static from(s: string | CurrencyID): CurrencyID {
        return s instanceof CurrencyID ? s : new CurrencyID(s)
    }
}