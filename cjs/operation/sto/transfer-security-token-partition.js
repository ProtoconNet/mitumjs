"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferSecurityTokenPartitionFact = exports.TransferSecurityTokenPartitionItem = void 0;
const item_1 = require("./item");
const partition_1 = require("./partition");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const types_1 = require("../../types");
const error_1 = require("../../error");
class TransferSecurityTokenPartitionItem extends item_1.STOItem {
    constructor(contract, tokenHolder, receiver, partition, amount, currency) {
        super(alias_1.HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.ITEM, contract, currency);
        this.tokenHolder = key_1.Address.from(tokenHolder);
        this.receiver = key_1.Address.from(receiver);
        this.partition = partition_1.Partition.from(partition);
        this.amount = types_1.Big.from(amount);
        error_1.Assert.check(this.contract.toString() !== this.tokenHolder.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "contract is same with token holder address"));
        error_1.Assert.check(this.contract.toString() !== this.receiver.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "contract is same with receiver address"));
        error_1.Assert.check(this.tokenHolder.toString() !== this.receiver.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "token holder is same with receiver address"));
        error_1.Assert.check(!this.amount.isZero(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "zero amount"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.tokenHolder.toBuffer(),
            this.receiver.toBuffer(),
            this.partition.toBuffer(),
            this.amount.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { tokenholder: this.tokenHolder.toString(), receiver: this.receiver.toString(), partition: this.partition.toString(), amount: this.amount.toString() });
    }
    toString() {
        return `${this.tokenHolder.toString()}-${this.receiver.toString()}-${this.partition.toString()}`;
    }
}
exports.TransferSecurityTokenPartitionItem = TransferSecurityTokenPartitionItem;
class TransferSecurityTokenPartitionFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate token holder-receiver-partition found in items"));
    }
    get operationHint() {
        return alias_1.HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.OPERATION;
    }
}
exports.TransferSecurityTokenPartitionFact = TransferSecurityTokenPartitionFact;
//# sourceMappingURL=transfer-security-token-partition.js.map