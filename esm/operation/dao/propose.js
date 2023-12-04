import { DAOFact } from "./fact";
import { HINT } from "../../alias";
import { Assert, ECODE, MitumError } from "../../error";
export class ProposeFact extends DAOFact {
    proposal;
    constructor(token, sender, contract, proposalID, proposal, currency) {
        super(HINT.DAO.PROPOSE.FACT, token, sender, contract, proposalID, currency);
        this.proposal = proposal;
        Assert.check(proposal.proposer.toString() === sender, MitumError.detail(ECODE.DAO.UNMATCHED_SENDER, `sender is unmatched with proposer of given proposal`));
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
        return {
            ...super.toHintedObject(),
            proposal: this.proposal.toHintedObject(),
        };
    }
    get operationHint() {
        return HINT.DAO.PROPOSE.OPERATION;
    }
}
//# sourceMappingURL=propose.js.map