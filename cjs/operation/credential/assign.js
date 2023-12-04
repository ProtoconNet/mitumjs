"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignFact = exports.AssignItem = void 0;
const base_1 = require("../base");
const item_1 = require("./item");
const alias_1 = require("../../alias");
const node_1 = require("../../node");
const error_1 = require("../../error");
const types_1 = require("../../types");
class AssignItem extends item_1.CredentialItem {
    constructor(contract, holder, templateID, id, value, validFrom, validUntil, did, currency) {
        super(alias_1.HINT.CREDENTIAL.ASSIGN.ITEM, contract, holder, templateID, id, currency);
        this.value = value;
        this.validFrom = types_1.Big.from(validFrom);
        this.validUntil = types_1.Big.from(validUntil);
        this.did = did;
        error_1.Assert.check(node_1.Config.CREDENTIAL.VALUE.satisfy(value.length), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "credential value length out of range"));
        error_1.Assert.check(validFrom < validUntil, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "valid until <= valid from"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.value),
            this.validFrom.toBuffer("fill"),
            this.validUntil.toBuffer("fill"),
            Buffer.from(this.did),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { value: this.value, valid_from: this.validFrom.v, valid_until: this.validUntil.v, did: this.did });
    }
    toString() {
        return `${super.toString()}-${this.id}`;
    }
}
exports.AssignItem = AssignItem;
class AssignFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.CREDENTIAL.ASSIGN.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate credential id found in items"));
    }
    get operationHint() {
        return alias_1.HINT.CREDENTIAL.ASSIGN.OPERATION;
    }
}
exports.AssignFact = AssignFact;
//# sourceMappingURL=assign.js.map