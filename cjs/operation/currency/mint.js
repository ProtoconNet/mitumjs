"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintFact = exports.MintItem = void 0;
const base_1 = require("../base");
const alias_1 = require("../../alias");
const node_1 = require("../../node");
const key_1 = require("../../key");
const utils_1 = require("../../utils");
const error_1 = require("../../error");
class MintItem extends base_1.Item {
    constructor(receiver, amount) {
        super(alias_1.HINT.CURRENCY.MINT.ITEM);
        this.amount = amount;
        this.receiver = key_1.Address.from(receiver);
    }
    toBuffer() {
        return Buffer.concat([
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toHintedObject() });
    }
    toString() {
        return `${this.receiver.toString()}-${this.amount.currency.toString()}`;
    }
}
exports.MintItem = MintItem;
class MintFact extends base_1.NodeFact {
    constructor(token, items) {
        super(alias_1.HINT.CURRENCY.MINT.FACT, token);
        error_1.Assert.check(node_1.Config.ITEMS_IN_FACT.satisfy(items.length), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "items length out of range"));
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate receiver-currency found in items"));
        this.items = items;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.concat(this.items.sort(utils_1.SortFunc).map(it => it.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { items: this.items.sort(utils_1.SortFunc).map(it => it.toHintedObject()) });
    }
    get operationHint() {
        return alias_1.HINT.CURRENCY.MINT.OPERATION;
    }
}
exports.MintFact = MintFact;
//# sourceMappingURL=mint.js.map