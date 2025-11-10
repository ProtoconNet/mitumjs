import { IBuffer, IString } from "../types"
import { Assert, ECODE, MitumError } from "../error"
import { Buffer } from "buffer";

export class Token implements IBuffer, IString {
    private s: string

    constructor(s: string) {
        Assert.check(s !== "", MitumError.detail(ECODE.INVALID_TOKEN, "empty token"))
        this.s = s
    }

    static from(s: string | Token) {
        return s instanceof Token ? s : new Token(s)
    }

    toBuffer(): Buffer {
        return Buffer.from(this.s)
    }

    toString(): string {
        return Buffer.from(this.s, "utf8").toString("base64")
    }
}