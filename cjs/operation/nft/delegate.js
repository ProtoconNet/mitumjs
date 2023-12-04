"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegateFact = exports.DelegateItem = void 0;
const item_1 = require("./item");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const error_1 = require("../../error");
class DelegateItem extends item_1.NFTItem {
    constructor(contract, operator, mode, currency) {
        super(alias_1.HINT.NFT.DELEGATE.ITEM, contract, currency);
        this.operator = key_1.Address.from(operator);
        this.mode = mode;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.operator.toBuffer(),
            Buffer.from(this.mode),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { delegatee: this.operator.toString(), mode: this.mode });
    }
    toString() {
        return `${super.toString()}-${this.operator.toString()}`;
    }
}
exports.DelegateItem = DelegateItem;
class DelegateFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.NFT.DELEGATE.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate operator found in items"));
        this.items.forEach(it => error_1.Assert.check(this.sender.toString() != it.contract.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return alias_1.HINT.NFT.DELEGATE.OPERATION;
    }
}
exports.DelegateFact = DelegateFact;
//# sourceMappingURL=delegate.js.map