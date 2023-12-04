"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAOFact = void 0;
const base_1 = require("../base");
const error_1 = require("../../error");
class DAOFact extends base_1.ContractFact {
    constructor(hint, token, sender, contract, proposalID, currency) {
        super(hint, token, sender, contract, currency);
        this.proposalID = proposalID;
        error_1.Assert.check(this.proposalID !== "", error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "empty proposal id"));
        // this._hash = this.hashing()
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.proposalID),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { proposal_id: this.proposalID });
    }
}
exports.DAOFact = DAOFact;
//# sourceMappingURL=fact.js.map