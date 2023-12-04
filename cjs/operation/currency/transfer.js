"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferFact = exports.TransferItem = void 0;
const item_1 = require("./item");
const base_1 = require("../base");
const utils_1 = require("../../utils");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const error_1 = require("../../error");
class TransferItem extends item_1.CurrencyItem {
    constructor(receiver, amounts) {
        super(alias_1.HINT.CURRENCY.TRANSFER.ITEM, amounts);
        if (typeof receiver === "string") {
            if (receiver.endsWith(alias_1.SUFFIX.ADDRESS.ZERO)) {
                this.receiver = new key_1.ZeroAddress(receiver);
            }
            else {
                this.receiver = new key_1.Address(receiver);
            }
        }
        else {
            this.receiver = receiver;
        }
        if (this.receiver.type === "zero") {
            for (const am of amounts) {
                error_1.Assert.check(am.currency.equal(this.receiver.currency), error_1.MitumError.detail(error_1.ECODE.INVALID_AMOUNT, "invalid amount currency for given zero address"));
            }
        }
    }
    toBuffer() {
        return Buffer.concat([
            this.receiver.toBuffer(),
            Buffer.concat(this.amounts.sort(utils_1.SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString() });
    }
    toString() {
        return this.receiver.toString();
    }
}
exports.TransferItem = TransferItem;
class TransferFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.CURRENCY.TRANSFER.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate receiver found in items"));
        this.items.forEach(it => error_1.Assert.check(this.sender.toString() != it.receiver.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "sender is same with receiver address")));
    }
    get operationHint() {
        return alias_1.HINT.CURRENCY.TRANSFER.OPERATION;
    }
}
exports.TransferFact = TransferFact;
//# sourceMappingURL=transfer.js.map