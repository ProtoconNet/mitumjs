"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSecurityTokenFact = exports.CreateSecurityTokenItem = void 0;
const item_1 = require("./item");
const partition_1 = require("./partition");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const types_1 = require("../../types");
const error_1 = require("../../error");
class CreateSecurityTokenItem extends item_1.STOItem {
    constructor(contract, granularity, defaultPartition, currency) {
        super(alias_1.HINT.STO.CREATE_SECURITY_TOKEN.ITEM, contract, currency);
        this.granularity = types_1.Big.from(granularity);
        this.defaultPartition = partition_1.Partition.from(defaultPartition);
        error_1.Assert.check(!this.granularity.isZero(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "zero granularity"));
    }
    toBuffer() {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.granularity.toBuffer("fill"),
            this.defaultPartition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { granularity: this.granularity.v, default_partition: this.defaultPartition.toString() });
    }
}
exports.CreateSecurityTokenItem = CreateSecurityTokenItem;
class CreateSecurityTokenFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.STO.CREATE_SECURITY_TOKEN.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate contract found in items"));
    }
    get operationHint() {
        return alias_1.HINT.STO.CREATE_SECURITY_TOKEN.OPERATION;
    }
}
exports.CreateSecurityTokenFact = CreateSecurityTokenFact;
//# sourceMappingURL=create-security-token.js.map