"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueSecurityTokenFact = exports.IssueSecurityTokenItem = void 0;
const item_1 = require("./item");
const partition_1 = require("./partition");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const types_1 = require("../../types");
const error_1 = require("../../error");
class IssueSecurityTokenItem extends item_1.STOItem {
    constructor(contract, receiver, amount, partition, currency) {
        super(alias_1.HINT.STO.ISSUE_SECURITY_TOKEN.ITEM, contract, currency);
        this.receiver = key_1.Address.from(receiver);
        this.amount = types_1.Big.from(amount);
        this.partition = partition_1.Partition.from(partition);
        error_1.Assert.check(this.contract.toString() !== this.receiver.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "contract is same with receiver address"));
        error_1.Assert.check(!this.amount.isZero(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "zero amount"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toString(), partition: this.partition.toString() });
    }
}
exports.IssueSecurityTokenItem = IssueSecurityTokenItem;
class IssueSecurityTokenFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.STO.ISSUE_SECURITY_TOKEN.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate contract found in items"));
    }
    get operationHint() {
        return alias_1.HINT.STO.ISSUE_SECURITY_TOKEN.OPERATION;
    }
}
exports.IssueSecurityTokenFact = IssueSecurityTokenFact;
//# sourceMappingURL=issue-sercurity-token.js.map