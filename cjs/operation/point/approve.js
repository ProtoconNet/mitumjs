"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveFact = void 0;
const fact_1 = require("./fact");
const types_1 = require("../../types");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const error_1 = require("../../error");
class ApproveFact extends fact_1.PointFact {
    constructor(token, sender, contract, currency, approved, amount) {
        super(alias_1.HINT.POINT.APPROVE.FACT, token, sender, contract, currency);
        this.approved = key_1.Address.from(approved);
        this.amount = types_1.Big.from(amount);
        error_1.Assert.check(this.contract.toString() !== this.approved.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "contract is same with approved address"));
        error_1.Assert.check(this.amount.compare(0) >= 0, error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "under zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { approved: this.approved.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return alias_1.HINT.POINT.APPROVE.OPERATION;
    }
}
exports.ApproveFact = ApproveFact;
//# sourceMappingURL=approve.js.map