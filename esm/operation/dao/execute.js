import { DAOFact } from "./fact";
import { HINT } from "../../alias";
export class ExecuteFact extends DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(HINT.DAO.EXECUTE.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.DAO.EXECUTE.OPERATION;
    }
}
//# sourceMappingURL=execute.js.map