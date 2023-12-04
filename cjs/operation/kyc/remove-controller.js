"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveControllerFact = exports.RemoveControllerItem = void 0;
const item_1 = require("./item");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const error_1 = require("../../error");
class RemoveControllerItem extends item_1.KYCItem {
    constructor(contract, controller, currency) {
        super(alias_1.HINT.KYC.REMOVE_CONTROLLER.ITEM, contract, currency);
        this.controller = key_1.Address.from(controller);
        error_1.Assert.check(this.contract.toString() !== this.controller.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "contract is same with controller address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.controller.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { controller: this.controller.toString() });
    }
    toString() {
        return `${super.toString()}-${this.controller.toString()}`;
    }
}
exports.RemoveControllerItem = RemoveControllerItem;
class RemoveControllerFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.KYC.REMOVE_CONTROLLER.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate controller found in items"));
    }
    get operationHint() {
        return alias_1.HINT.KYC.REMOVE_CONTROLLER.OPERATION;
    }
}
exports.RemoveControllerFact = RemoveControllerFact;
//# sourceMappingURL=remove-controller.js.map