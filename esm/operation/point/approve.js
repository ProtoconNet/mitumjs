import { PointFact } from "./fact";
import { Big } from "../../types";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { Assert, ECODE, MitumError } from "../../error";
export class ApproveFact extends PointFact {
    approved;
    amount;
    constructor(token, sender, contract, currency, approved, amount) {
        super(HINT.POINT.APPROVE.FACT, token, sender, contract, currency);
        this.approved = Address.from(approved);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.approved.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with approved address"));
        Assert.check(this.amount.compare(0) >= 0, MitumError.detail(ECODE.INVALID_FACT, "under zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            approved: this.approved.toString(),
            amount: this.amount.toString(),
        };
    }
    get operationHint() {
        return HINT.POINT.APPROVE.OPERATION;
    }
}
//# sourceMappingURL=approve.js.map