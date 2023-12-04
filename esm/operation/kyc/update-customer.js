import { KYCItem } from "./item";
import { OperationFact } from "../base";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { Bool } from "../../types";
import { Assert, ECODE, MitumError } from "../../error";
export class UpdateCustomerItem extends KYCItem {
    customer;
    status;
    constructor(contract, customer, status, currency) {
        super(HINT.KYC.UPDATE_CUSTOMER.ITEM, contract, currency);
        this.customer = Address.from(customer);
        this.status = Bool.from(status);
        Assert.check(this.contract.toString() !== this.customer.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with customer address"));
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
        return {
            ...super.toHintedObject(),
            customer: this.customer.toString(),
            status: this.status.v,
        };
    }
    toString() {
        return `${super.toString()}-${this.customer.toString()}`;
    }
}
export class UpdateCustomerFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.KYC.UPDATE_CUSTOMER.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate customer found in items"));
    }
    get operationHint() {
        return HINT.KYC.UPDATE_CUSTOMER.OPERATION;
    }
}
//# sourceMappingURL=update-customer.js.map