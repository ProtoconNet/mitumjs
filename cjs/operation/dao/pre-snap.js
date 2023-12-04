"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreSnapFact = void 0;
const fact_1 = require("./fact");
const alias_1 = require("../../alias");
class PreSnapFact extends fact_1.DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(alias_1.HINT.DAO.PRE_SNAP.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return alias_1.HINT.DAO.PRE_SNAP.OPERATION;
    }
}
exports.PreSnapFact = PreSnapFact;
//# sourceMappingURL=pre-snap.js.map