"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemTokenFact = exports.RedeemTokenItem = void 0;
const item_1 = require("./item");
const partition_1 = require("./partition");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const types_1 = require("../../types");
const error_1 = require("../../error");
class RedeemTokenItem extends item_1.STOItem {
    constructor(contract, tokenHolder, amount, partition, currency) {
        super(alias_1.HINT.STO.REDEEM.ITEM, contract, currency);
        this.tokenHolder = key_1.Address.from(tokenHolder);
        this.amount = types_1.Big.from(amount);
        this.partition = partition_1.Partition.from(partition);
        error_1.Assert.check(this.contract.toString() !== this.tokenHolder.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "contract is same with token holder address"));
        error_1.Assert.check(!this.amount.isZero(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "zero amount"));
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
        return Object.assign(Object.assign({}, super.toHintedObject()), { tokenHolder: this.tokenHolder.toString(), amount: this.amount.toString(), partition: this.partition.toString() });
    }
    toString() {
        return this.tokenHolder.toString();
    }
}
exports.RedeemTokenItem = RedeemTokenItem;
class RedeemTokenFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.STO.REDEEM.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate token holder found in items"));
    }
    get operationHint() {
        return alias_1.HINT.STO.REDEEM.OPERATION;
    }
}
exports.RedeemTokenFact = RedeemTokenFact;
//# sourceMappingURL=redeem-token.js.map