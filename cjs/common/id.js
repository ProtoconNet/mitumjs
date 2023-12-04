"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractID = exports.CurrencyID = void 0;
const node_1 = require("../node");
const error_1 = require("../error");
class ID {
    constructor(s) {
        this.s = s;
    }
    equal(id) {
        return this.toString() === id.toString();
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}
class CurrencyID extends ID {
    constructor(s) {
        super(s);
        error_1.Assert.check(node_1.Config.CURRENCY_ID.satisfy(s.length), error_1.MitumError.detail(error_1.ECODE.INVALID_CURRENCY_ID, "currency id length out of range"));
        error_1.Assert.check(/^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s), error_1.MitumError.detail(error_1.ECODE.INVALID_CURRENCY_ID, "invalid currency id format"));
    }
    static from(s) {
        return s instanceof CurrencyID ? s : new CurrencyID(s);
    }
}
exports.CurrencyID = CurrencyID;
class ContractID extends ID {
    constructor(s) {
        super(s);
        error_1.Assert.check(node_1.Config.CONTRACT_ID.satisfy(s.length), error_1.MitumError.detail(error_1.ECODE.INVALID_CONTRACT_ID, "contract id length out of range"));
        error_1.Assert.check(/^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s), error_1.MitumError.detail(error_1.ECODE.INVALID_CONTRACT_ID, "invalid contract id format"));
    }
    static from(s) {
        return s instanceof ContractID ? s : new ContractID(s);
    }
}
exports.ContractID = ContractID;
//# sourceMappingURL=id.js.map