import { Buffer } from "buffer";
import { HINT } from "../../alias"
import { Hint } from "../../common"
import { Config } from "../../node"
import { Address } from "../../key/address"
import { ArrayAssert } from "../../error"
import { SortFunc } from "../../utils"
import { Bool } from "../../types"
import type { HintedObject, IBuffer, IHintedObject } from "../../types"

export class Whitelist implements IBuffer, IHintedObject {
    private hint: Hint
    readonly active: Bool
    readonly accounts: Address[]

    constructor(active: boolean | Bool, accounts: (string | Address)[]) {
        this.hint = new Hint(HINT.DAO.WHITELIST)
        this.active = Bool.from(active)
        this.accounts = accounts ? accounts.map(a => Address.from(a)) : []

        ArrayAssert.check(accounts, "whitelist").rangeLength(Config.DAO.ADDRESS_IN_WHITELIST).noDuplicates()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.active.toBuffer(),
            Buffer.concat(this.accounts.sort(SortFunc).map(a => a.toBuffer())),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString(),
            active: this.active.v,
            accounts: this.accounts.sort(SortFunc).map(a => a.toString()),
        }
    }
}