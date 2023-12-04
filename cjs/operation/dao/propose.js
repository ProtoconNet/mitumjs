"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposeFact = void 0;
const fact_1 = require("./fact");
const alias_1 = require("../../alias");
const error_1 = require("../../error");
class ProposeFact extends fact_1.DAOFact {
    constructor(token, sender, contract, proposalID, proposal, currency) {
        super(alias_1.HINT.DAO.PROPOSE.FACT, token, sender, contract, proposalID, currency);
        this.proposal = proposal;
        error_1.Assert.check(proposal.proposer.toString() === sender, error_1.MitumError.detail(error_1.ECODE.DAO.UNMATCHED_SENDER, `sender is unmatched with proposer of given proposal`));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.proposal.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { proposal: this.proposal.toHintedObject() });
    }
    get operationHint() {
        return alias_1.HINT.DAO.PROPOSE.OPERATION;
    }
}
exports.ProposeFact = ProposeFact;
//# sourceMappingURL=propose.js.map