"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevokeFact = exports.RevokeItem = void 0;
const base_1 = require("../base");
const item_1 = require("./item");
const alias_1 = require("../../alias");
const error_1 = require("../../error");
class RevokeItem extends item_1.CredentialItem {
    constructor(contract, holder, templateID, id, currency) {
        super(alias_1.HINT.CREDENTIAL.REVOKE.ITEM, contract, holder, templateID, id, currency);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toString() {
        return `${super.toString()}-${this.id}`;
    }
}
exports.RevokeItem = RevokeItem;
class RevokeFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.CREDENTIAL.REVOKE.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate credential id found in items"));
    }
    get operationHint() {
        return alias_1.HINT.CREDENTIAL.REVOKE.OPERATION;
    }
}
exports.RevokeFact = RevokeFact;
//# sourceMappingURL=revoke.js.map