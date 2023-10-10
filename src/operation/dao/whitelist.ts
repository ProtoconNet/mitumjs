import { HINT } from "../../alias"
import { Hint } from "../../common"
import { Config } from "../../node"
import { Address } from "../../key"
import { Assert, ECODE, MitumError } from "../../error"
import { SortFunc, hasOverlappingAddress } from "../../utils"
import { Bool, HintedObject, IBuffer, IHintedObject } from "../../types"

export class Whitelist implements IBuffer, IHintedObject {
    private hint: Hint
    readonly active: Bool
    readonly accounts: Address[]

    constructor(active: boolean | Bool, accounts: (string | Address)[]) {
        this.hint = new Hint(HINT.DAO.WHITELIST)
        this.active = Bool.from(active)
        this.accounts = accounts ? accounts.map(a => Address.from(a)) : []

        Assert.check(
            Config.DAO.ADDRESS_IN_WHITELIST.satisfy(accounts.length),
            MitumError.detail(ECODE.DAO.INVALID_WHITELIST, "whitelist length out of range"),
        )

        Assert.check(
            hasOverlappingAddress(accounts),
            MitumError.detail(ECODE.DAO.INVALID_WHITELIST, "duplicate account found in whitelist")
        )
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