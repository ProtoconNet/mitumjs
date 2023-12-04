import { DAOFact } from "./fact";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { Assert, ECODE, MitumError } from "../../error";
export class RegisterFact extends DAOFact {
    delegated;
    constructor(token, sender, contract, proposalID, delegated, currency) {
        super(HINT.DAO.REGISTER.FACT, token, sender, contract, proposalID, currency);
        this.delegated = Address.from(delegated);
        Assert.check(this.contract.toString() !== this.delegated.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with delegated address"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.delegated.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            delegated: this.delegated.toString(),
        };
    }
    get operationHint() {
        return HINT.DAO.REGISTER.OPERATION;
    }
}
//# sourceMappingURL=register.js.map