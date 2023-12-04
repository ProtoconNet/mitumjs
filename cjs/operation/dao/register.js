"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFact = void 0;
const fact_1 = require("./fact");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const error_1 = require("../../error");
class RegisterFact extends fact_1.DAOFact {
    constructor(token, sender, contract, proposalID, delegated, currency) {
        super(alias_1.HINT.DAO.REGISTER.FACT, token, sender, contract, proposalID, currency);
        this.delegated = key_1.Address.from(delegated);
        error_1.Assert.check(this.contract.toString() !== this.delegated.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "contract is same with delegated address"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.delegated.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { delegated: this.delegated.toString() });
    }
    get operationHint() {
        return alias_1.HINT.DAO.REGISTER.OPERATION;
    }
}
exports.RegisterFact = RegisterFact;
//# sourceMappingURL=register.js.map