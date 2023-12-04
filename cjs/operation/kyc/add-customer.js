"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCustomerFact = exports.AddCustomerItem = void 0;
const item_1 = require("./item");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const types_1 = require("../../types");
const error_1 = require("../../error");
class AddCustomerItem extends item_1.KYCItem {
    constructor(contract, customer, status, currency) {
        super(alias_1.HINT.KYC.ADD_CUSTOMER.ITEM, contract, currency);
        this.customer = key_1.Address.from(customer);
        this.status = types_1.Bool.from(status);
        error_1.Assert.check(this.contract.toString() !== this.customer.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "contract is same with customer address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.customer.toBuffer(),
            this.status.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { customer: this.customer.toString(), status: this.status.v });
    }
    toString() {
        return `${super.toString()}-${this.customer.toString()}`;
    }
}
exports.AddCustomerItem = AddCustomerItem;
class AddCustomerFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.KYC.ADD_CUSTOMER.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate customer found in items"));
    }
    get operationHint() {
        return alias_1.HINT.KYC.ADD_CUSTOMER.OPERATION;
    }
}
exports.AddCustomerFact = AddCustomerFact;
//# sourceMappingURL=add-customer.js.map