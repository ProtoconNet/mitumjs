import { TokenFact } from "./fact";
import { Big } from "../../types";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { Assert, ECODE, MitumError } from "../../error";
export class TransferFromFact extends TokenFact {
    receiver;
    target;
    amount;
    constructor(token, sender, contract, currency, receiver, target, amount) {
        super(HINT.TOKEN.TRANSFER_FROM.FACT, token, sender, contract, currency);
        this.receiver = Address.from(receiver);
        this.target = Address.from(target);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with receiver address"));
        Assert.check(this.contract.toString() !== this.target.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with target address"));
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.target.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            target: this.target.toString(),
            amount: this.amount.toString(),
        };
    }
    get operationHint() {
        return HINT.TOKEN.TRANSFER_FROM.OPERATION;
    }
}
//# sourceMappingURL=transfer-from.js.map