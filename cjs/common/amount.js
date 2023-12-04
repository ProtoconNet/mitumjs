"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amount = void 0;
const hint_1 = require("./hint");
const id_1 = require("./id");
const alias_1 = require("../alias");
const error_1 = require("../error");
const types_1 = require("../types");
class Amount {
    constructor(currency, big) {
        this.hint = new hint_1.Hint(alias_1.HINT.CURRENCY.AMOUNT);
        this.currency = id_1.CurrencyID.from(currency);
        this.big = types_1.Big.from(big);
        error_1.Assert.check(0 < this.big.big, error_1.MitumError.detail(error_1.ECODE.INVALID_AMOUNT, "zero big"));
    }
    toBuffer() {
        return Buffer.concat([
            this.big.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            currency: this.currency.toString(),
            amount: this.big.toString(),
        };
    }
}
exports.Amount = Amount;
//# sourceMappingURL=amount.js.map