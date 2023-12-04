import { ContractFact } from "../base";
import { Assert, ECODE, MitumError } from "../../error";
export class DAOFact extends ContractFact {
    proposalID;
    constructor(hint, token, sender, contract, proposalID, currency) {
        super(hint, token, sender, contract, currency);
        this.proposalID = proposalID;
        Assert.check(this.proposalID !== "", MitumError.detail(ECODE.INVALID_FACT, "empty proposal id"));
        // this._hash = this.hashing()
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.proposalID),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            proposal_id: this.proposalID,
        };
    }
}
//# sourceMappingURL=fact.js.map