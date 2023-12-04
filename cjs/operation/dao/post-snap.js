"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSnapFact = void 0;
const fact_1 = require("./fact");
const alias_1 = require("../../alias");
class PostSnapFact extends fact_1.DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(alias_1.HINT.DAO.POST_SNAP.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return alias_1.HINT.DAO.POST_SNAP.OPERATION;
    }
}
exports.PostSnapFact = PostSnapFact;
//# sourceMappingURL=post-snap.js.map