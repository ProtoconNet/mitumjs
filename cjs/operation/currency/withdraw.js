"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawFact = exports.WithdrawItem = void 0;
const item_1 = require("./item");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const utils_1 = require("../../utils");
const error_1 = require("../../error");
class WithdrawItem extends item_1.CurrencyItem {
    constructor(target, amounts) {
        super(alias_1.HINT.CURRENCY.WITHDRAW.ITEM, amounts);
        this.target = typeof target === "string" ? new key_1.Address(target) : target;
    }
    toBuffer() {
        return Buffer.concat([
            this.target.toBuffer(),
            Buffer.concat(this.amounts.sort(utils_1.SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { target: this.target.toString() });
    }
    toString() {
        return this.target.toString();
    }
}
exports.WithdrawItem = WithdrawItem;
class WithdrawFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.CURRENCY.WITHDRAW.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate target found in items"));
        this.items.forEach(it => error_1.Assert.check(this.sender.toString() != it.target.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "sender is same with target address")));
    }
    get operationHint() {
        return alias_1.HINT.CURRENCY.WITHDRAW.OPERATION;
    }
}
exports.WithdrawFact = WithdrawFact;
//# sourceMappingURL=withdraw.js.map