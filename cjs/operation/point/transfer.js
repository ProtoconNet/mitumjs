"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferFact = void 0;
const fact_1 = require("./fact");
const types_1 = require("../../types");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const error_1 = require("../../error");
class TransferFact extends fact_1.PointFact {
    constructor(token, sender, contract, currency, receiver, amount) {
        super(alias_1.HINT.POINT.TRANSFER.FACT, token, sender, contract, currency);
        this.receiver = key_1.Address.from(receiver);
        this.amount = types_1.Big.from(amount);
        error_1.Assert.check(this.contract.toString() !== this.receiver.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "contract is same with receiver address"));
        error_1.Assert.check(this.amount.compare(0) > 0, error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return alias_1.HINT.POINT.TRANSFER.OPERATION;
    }
}
exports.TransferFact = TransferFact;
//# sourceMappingURL=transfer.js.map