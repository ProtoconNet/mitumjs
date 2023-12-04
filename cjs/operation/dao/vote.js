"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteFact = void 0;
const fact_1 = require("./fact");
const types_1 = require("../../types");
const alias_1 = require("../../alias");
const node_1 = require("../../node");
const error_1 = require("../../error");
class VoteFact extends fact_1.DAOFact {
    constructor(token, sender, contract, proposalID, vote, currency) {
        super(alias_1.HINT.DAO.VOTE.FACT, token, sender, contract, proposalID, currency);
        error_1.Assert.check(node_1.Config.DAO.VOTE.satisfy(Number(vote)), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "vote option out of range"));
        this.vote = types_1.Big.from(vote);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.vote.v === 0 ? Buffer.from([0x00]) : this.vote.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { vote: this.vote.v });
    }
    get operationHint() {
        return alias_1.HINT.DAO.VOTE.OPERATION;
    }
}
exports.VoteFact = VoteFact;
//# sourceMappingURL=vote.js.map