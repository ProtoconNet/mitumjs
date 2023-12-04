import { STOItem } from "./item";
import { Partition } from "./partition";
import { OperationFact } from "../base";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { Big } from "../../types";
import { Assert, ECODE, MitumError } from "../../error";
export class RedeemTokenItem extends STOItem {
    tokenHolder;
    amount;
    partition;
    constructor(contract, tokenHolder, amount, partition, currency) {
        super(HINT.STO.REDEEM.ITEM, contract, currency);
        this.tokenHolder = Address.from(tokenHolder);
        this.amount = Big.from(amount);
        this.partition = Partition.from(partition);
        Assert.check(this.contract.toString() !== this.tokenHolder.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with token holder address"));
        Assert.check(!this.amount.isZero(), MitumError.detail(ECODE.INVALID_ITEM, "zero amount"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.tokenHolder.toBuffer(),
            this.amount.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            tokenHolder: this.tokenHolder.toString(),
            amount: this.amount.toString(),
            partition: this.partition.toString(),
        };
    }
    toString() {
        return this.tokenHolder.toString();
    }
}
export class RedeemTokenFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.STO.REDEEM.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate token holder found in items"));
    }
    get operationHint() {
        return HINT.STO.REDEEM.OPERATION;
    }
}
//# sourceMappingURL=redeem-token.js.map