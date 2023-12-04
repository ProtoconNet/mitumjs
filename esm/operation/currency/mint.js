import { Item, NodeFact } from "../base";
import { HINT } from "../../alias";
import { Config } from "../../node";
import { Address } from "../../key";
import { SortFunc } from "../../utils";
import { Assert, ECODE, MitumError } from "../../error";
export class MintItem extends Item {
    amount;
    receiver;
    constructor(receiver, amount) {
        super(HINT.CURRENCY.MINT.ITEM);
        this.amount = amount;
        this.receiver = Address.from(receiver);
    }
    toBuffer() {
        return Buffer.concat([
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            amount: this.amount.toHintedObject(),
        };
    }
    toString() {
        return `${this.receiver.toString()}-${this.amount.currency.toString()}`;
    }
}
export class MintFact extends NodeFact {
    items;
    constructor(token, items) {
        super(HINT.CURRENCY.MINT.FACT, token);
        Assert.check(Config.ITEMS_IN_FACT.satisfy(items.length), MitumError.detail(ECODE.INVALID_ITEMS, "items length out of range"));
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate receiver-currency found in items"));
        this.items = items;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.concat(this.items.sort(SortFunc).map(it => it.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            items: this.items.sort(SortFunc).map(it => it.toHintedObject()),
        };
    }
    get operationHint() {
        return HINT.CURRENCY.MINT.OPERATION;
    }
}
//# sourceMappingURL=mint.js.map