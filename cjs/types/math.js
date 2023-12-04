"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bool = exports.Uint8 = exports.Float = exports.Big = void 0;
const int64_buffer_1 = __importDefault(require("int64-buffer"));
const big_integer_1 = __importDefault(require("big-integer"));
const error_1 = require("../error");
class Big {
    constructor(big) {
        switch (typeof big) {
            case "number":
            case "string":
            case "bigint":
                this.big = BigInt(big);
                break;
            case "object":
                if (big instanceof Buffer || big instanceof Uint8Array) {
                    this.big = this.bufferToBig(big);
                }
                else {
                    throw error_1.MitumError.detail(error_1.ECODE.INVALID_BIG_INTEGER, "wrong big");
                }
                break;
            default:
                throw error_1.MitumError.detail(error_1.ECODE.INVALID_BIG_INTEGER, "wrong big");
        }
    }
    static from(big) {
        return big instanceof Big ? big : new Big(big);
    }
    bufferToBig(big) {
        const res = [];
        Uint8Array.from(big).forEach((n) => {
            let s = n.toString(16);
            s.length % 2 ? res.push("0" + s) : res.push(s);
        });
        return BigInt("0x" + res.join(""));
    }
    toBuffer(option) {
        const size = this.byteLen();
        if (option === "fill") {
            error_1.Assert.check(size <= 8, error_1.MitumError.detail(error_1.ECODE.INVALID_BIG_INTEGER, "big out of range"));
            return Buffer.from(new int64_buffer_1.default.Uint64BE(this.toString()).toBuffer());
        }
        const buf = new Uint8Array(size);
        let n = (0, big_integer_1.default)(this.big);
        for (let i = size - 1; i >= 0; i--) {
            buf[i] = n.mod(256).valueOf();
            n = n.divide(256);
        }
        return Buffer.from(buf);
    }
    byteLen() {
        const bitLen = (0, big_integer_1.default)(this.big).bitLength();
        const quotient = (0, big_integer_1.default)(bitLen).divide(8);
        if (bitLen.valueOf() - quotient.valueOf() * 8 > 0) {
            return quotient.valueOf() + 1;
        }
        return quotient.valueOf();
    }
    get v() {
        if (this.big <= BigInt(Number.MAX_SAFE_INTEGER)) {
            return parseInt(this.toString());
        }
        return -1;
    }
    toString() {
        return this.big.toString();
    }
    isZero() {
        return this.big < 1;
    }
    compare(n) {
        n = Big.from(n);
        if (this.big < n.big) {
            return -1;
        }
        else if (this.big > n.big) {
            return 1;
        }
        return 0;
    }
}
exports.Big = Big;
class Float {
    constructor(n) {
        this.n = n;
    }
    static from(n) {
        return n instanceof Float ? n : new Float(n);
    }
    toBuffer() {
        const b = Buffer.allocUnsafe(8);
        b.writeDoubleBE(this.n);
        return b;
    }
    toString() {
        return "" + this.n;
    }
}
exports.Float = Float;
class Uint8 {
    constructor(n) {
        error_1.Assert.check(0 <= n && n <= 255, error_1.MitumError.detail(error_1.ECODE.INVALID_UINT8, "uint8 out of range"));
        this.n = n;
    }
    static from(n) {
        return n instanceof Uint8 ? n : new Uint8(n);
    }
    toBuffer() {
        const buffer = Buffer.alloc(1);
        buffer.writeUint8(this.n, 0);
        return buffer;
    }
    get v() {
        return this.n;
    }
    toString() {
        return this.n.toString();
    }
}
exports.Uint8 = Uint8;
class Bool {
    constructor(b) {
        this.b = b;
    }
    static from(b) {
        return b instanceof Bool ? b : new Bool(b);
    }
    toBuffer() {
        return this.b ? Buffer.from([1]) : Buffer.from([0]);
    }
    get v() {
        return this.b;
    }
}
exports.Bool = Bool;
//# sourceMappingURL=math.js.map