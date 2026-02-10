import { IBuffer, IString } from "../types"
import { Assert, ECODE, MitumError } from "../error"
import { Buffer } from "buffer";

export class LongString implements IBuffer, IString {
    private s: string

    constructor(s: string) {
        Assert.check(typeof(s) === "string", MitumError.detail(ECODE.INVALID_TYPE, `${s} is not in string type`))
        Assert.check(s !== "", MitumError.detail(ECODE.EMPTY_STRING, "empty string"))
        this.s = s
    }

    static from(s: string | LongString) {
        return s instanceof LongString ? s : new LongString(s)
    }

    toBuffer(): Buffer {
        return Buffer.from(this.s)
    }

    toString(): string {
        return this.s
    }
}

export class ShortDate extends LongString {
    constructor(s: string) {
        super(s)
        Assert.check(
            /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(s),
            MitumError.detail(ECODE.INVALID_DATE, "invalid simple string date"),
        )
    }

    static from(s: string | ShortDate) {
        return s instanceof ShortDate ? s : new ShortDate(s)
    }
}

export class IP extends LongString {
    constructor(s: string) {
        super(s)
        Assert.check(typeof(s) === "string", MitumError.detail(ECODE.INVALID_TYPE, `${s} is not in string type`))
        Assert.check(s !== "", MitumError.detail(ECODE.EMPTY_STRING, "empty string"))
        Assert.check(
            /^(http|https):\/\/(?:[\w-]+\.)*[\w-]+(?::\d+)?(?:\/[\w-./?%&=]*)?$/.test(s),
            MitumError.detail(ECODE.INVALID_IP, "invalid ip address, ip"),
        )
    }

    static from(s: string | IP) {
        return s instanceof IP ? s : new IP(s)
    }
}

export class URIString implements IBuffer, IString {
    private s: string

    constructor(s: string, name: string) {
        Assert.check(
            (/^[^\s:/?#\[\]@]*$/.test(s)), 
            MitumError.detail(ECODE.INVALID_CHARACTER, `${name} must not contain: space / : ? # [ ] @`)
        )
        this.s = s
    }

    toBuffer(): Buffer {
        return Buffer.from(this.s)
    }

    toString(): string {
        return this.s
    }
}