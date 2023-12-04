import { TokenFact } from "./fact";
import { Big } from "../../types";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { Assert, ECODE, MitumError } from "../../error";
export class TransferFact extends TokenFact {
    receiver;
    amount;
    constructor(token, sender, contract, currency, receiver, amount) {
        super(HINT.TOKEN.TRANSFER.FACT, token, sender, contract, currency);
        this.receiver = Address.from(receiver);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with receiver address"));
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            amount: this.amount.toString(),
        };
    }
    get operationHint() {
        return HINT.TOKEN.TRANSFER.OPERATION;
    }
}
//# sourceMappingURL=transfer.js.map