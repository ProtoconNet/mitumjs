import { KYCItem } from "./item";
import { OperationFact } from "../base";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { Assert, ECODE, MitumError } from "../../error";
export class RemoveControllerItem extends KYCItem {
    controller;
    constructor(contract, controller, currency) {
        super(HINT.KYC.REMOVE_CONTROLLER.ITEM, contract, currency);
        this.controller = Address.from(controller);
        Assert.check(this.contract.toString() !== this.controller.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with controller address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.controller.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            controller: this.controller.toString(),
        };
    }
    toString() {
        return `${super.toString()}-${this.controller.toString()}`;
    }
}
export class RemoveControllerFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.KYC.REMOVE_CONTROLLER.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate controller found in items"));
    }
    get operationHint() {
        return HINT.KYC.REMOVE_CONTROLLER.OPERATION;
    }
}
//# sourceMappingURL=remove-controller.js.map