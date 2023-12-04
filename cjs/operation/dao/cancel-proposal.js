"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelProposalFact = void 0;
const fact_1 = require("./fact");
const alias_1 = require("../../alias");
class CancelProposalFact extends fact_1.DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(alias_1.HINT.DAO.CANCEL_PROPOSAL.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return alias_1.HINT.DAO.CANCEL_PROPOSAL.OPERATION;
    }
}
exports.CancelProposalFact = CancelProposalFact;
//# sourceMappingURL=cancel-proposal.js.map