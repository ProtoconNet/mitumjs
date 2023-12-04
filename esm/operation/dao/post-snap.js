import { DAOFact } from "./fact";
import { HINT } from "../../alias";
export class PostSnapFact extends DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(HINT.DAO.POST_SNAP.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.DAO.POST_SNAP.OPERATION;
    }
}
//# sourceMappingURL=post-snap.js.map