"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IP = exports.ShortDate = exports.LongString = void 0;
const error_1 = require("../error");
class LongString {
    constructor(s) {
        error_1.Assert.check(s !== "", error_1.MitumError.detail(error_1.ECODE.EMPTY_STRING, "empty string"));
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
exports.LongString = LongString;
class ShortDate extends LongString {
    constructor(s) {
        super(s);
        error_1.Assert.check(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(s), error_1.MitumError.detail(error_1.ECODE.INVALID_DATE, "invalid simple string date"));
    }
    static from(s) {
        return s instanceof ShortDate ? s : new ShortDate(s);
    }
}
exports.ShortDate = ShortDate;
class IP extends LongString {
    constructor(s) {
        super(s);
        error_1.Assert.check(/^(http|https):\/\/(\d{1,3}\.){3}\d{1,3}(?::\d+)?$/.test(s)
            || /^(http|https):\/\/(?:[\w-]+\.)+[\w-]+(?::\d+)?(?:\/[\w-./?%&=]*)?$/.test(s), error_1.MitumError.detail(error_1.ECODE.INVALID_IP, "invalid ip address, ip"));
    }
    static from(s) {
        return s instanceof IP ? s : new IP(s);
    }
}
exports.IP = IP;
//# sourceMappingURL=string.js.map