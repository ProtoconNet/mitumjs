import { DAOFact } from "./fact";
import { Big } from "../../types";
import { HINT } from "../../alias";
import { Config } from "../../node";
import { Assert, ECODE, MitumError } from "../../error";
export class VoteFact extends DAOFact {
    vote;
    constructor(token, sender, contract, proposalID, vote, currency) {
        super(HINT.DAO.VOTE.FACT, token, sender, contract, proposalID, currency);
        Assert.check(Config.DAO.VOTE.satisfy(Number(vote)), MitumError.detail(ECODE.INVALID_FACT, "vote option out of range"));
        this.vote = Big.from(vote);
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
        return {
            ...super.toHintedObject(),
            vote: this.vote.v,
        };
    }
    get operationHint() {
        return HINT.DAO.VOTE.OPERATION;
    }
}
//# sourceMappingURL=vote.js.map