"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeOperatorFact = exports.AuthorizeOperatorItem = void 0;
const item_1 = require("./item");
const partition_1 = require("./partition");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const error_1 = require("../../error");
class AuthorizeOperatorItem extends item_1.STOItem {
    constructor(contract, operator, partition, currency) {
        super(alias_1.HINT.STO.AUTHORIZE_OPERATOR.ITEM, contract, currency);
        this.operator = key_1.Address.from(operator);
        this.partition = partition_1.Partition.from(partition);
        error_1.Assert.check(this.contract.toString() !== this.operator.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "contract is same with operator address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.operator.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { operator: this.operator.toString(), partition: this.partition.toString() });
    }
    toString() {
        return this.operator.toString();
    }
}
exports.AuthorizeOperatorItem = AuthorizeOperatorItem;
class AuthorizeOperatorFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.STO.AUTHORIZE_OPERATOR.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate operator found in items"));
    }
    get operationHint() {
        return alias_1.HINT.STO.AUTHORIZE_OPERATOR.OPERATION;
    }
}
exports.AuthorizeOperatorFact = AuthorizeOperatorFact;
//# sourceMappingURL=authorize-operator.js.map