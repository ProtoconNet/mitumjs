import { Assert, ECODE, MitumError } from "../utils/error.js";
import { MitumConfig } from "../utils/config.js";
import { SortFunc } from "../utils/math.js";
import { NodeFact } from "../types/fact.js";
import { Item } from "../types/item.js";
import { HINT } from "../types/hint.js";
import { Address } from "../account/address.js";
export class SuffrageInflationItem extends Item {
    constructor(receiver, amount) {
        super(HINT.SUFFRAGE_INFLATION_ITEM);
        this.amount = amount;
        this.receiver = Address.from(receiver);
    }
    toBuffer() {
        return Buffer.concat([this.receiver.toBuffer(), this.amount.toBuffer()]);
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
export class SuffrageInflationFact extends NodeFact {
    constructor(token, items) {
        super(HINT.SUFFRAGE_INFLATION_ITEM, token);
        Assert.check(MitumConfig.ITEMS_IN_FACT.satisfy(items.length), MitumError.detail(ECODE.INVALID_ITEMS, "items length out of range"));
        Assert.check(new Set(items.map((it) => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate receiver-currency found in items"));
        this.items = items;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.concat(this.items.sort(SortFunc).map((it) => it.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            items: this.items.sort(SortFunc).map((it) => it.toHintedObject()),
        };
    }
    get operationHint() {
        return HINT.SUFFRAGE_INFLATION_OPERATION;
    }
}
//# sourceMappingURL=inflate.js.map