import { DAOFact } from "./fact";
import { HINT } from "../../alias";
export class PreSnapFact extends DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(HINT.DAO.PRE_SNAP.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.DAO.PRE_SNAP.OPERATION;
    }
}
//# sourceMappingURL=pre-snap.js.map