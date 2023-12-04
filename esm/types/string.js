import { Assert, ECODE, MitumError } from "../error";
export class LongString {
    s;
    constructor(s) {
        Assert.check(s !== "", MitumError.detail(ECODE.EMPTY_STRING, "empty string"));
        this.s = s;
    }
    static from(s) {
        return s instanceof LongString ? s : new LongString(s);
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}
export class ShortDate extends LongString {
    constructor(s) {
        super(s);
        Assert.check(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(s), MitumError.detail(ECODE.INVALID_DATE, "invalid simple string date"));
    }
    static from(s) {
        return s instanceof ShortDate ? s : new ShortDate(s);
    }
}
export class IP extends LongString {
    constructor(s) {
        super(s);
        Assert.check(/^(http|https):\/\/(\d{1,3}\.){3}\d{1,3}(?::\d+)?$/.test(s)
            || /^(http|https):\/\/(?:[\w-]+\.)+[\w-]+(?::\d+)?(?:\/[\w-./?%&=]*)?$/.test(s), MitumError.detail(ECODE.INVALID_IP, "invalid ip address, ip"));
    }
    static from(s) {
        return s instanceof IP ? s : new IP(s);
    }
}
//# sourceMappingURL=string.js.map