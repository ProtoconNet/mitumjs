import { Config } from "../../node"
import type { IBuffer, IString } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class Partition implements IBuffer, IString {
    private s: string

    constructor(s: string) {
        Assert.check(
            Config.STO.PARTITION.satisfy(s.length),
            MitumError.detail(ECODE.STO.INVALID_PARTITION, "partition length out of range")
        )
        Assert.check(
            /^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s),
            MitumError.detail(ECODE.STO.INVALID_PARTITION, "invalid partition format"),
        )
        this.s = s
    }

    static from(s: string | Partition) {
        return s instanceof Partition ? s : new Partition(s)
    }

    toBuffer(): Buffer {
        return Buffer.from(this.s)
    }

    toString(): string {
        return this.s
    }
}