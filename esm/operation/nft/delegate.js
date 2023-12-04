import { NFTItem } from "./item";
import { OperationFact } from "../base";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { Assert, ECODE, MitumError } from "../../error";
export class DelegateItem extends NFTItem {
    operator;
    mode;
    constructor(contract, operator, mode, currency) {
        super(HINT.NFT.DELEGATE.ITEM, contract, currency);
        this.operator = Address.from(operator);
        this.mode = mode;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.operator.toBuffer(),
            Buffer.from(this.mode),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            delegatee: this.operator.toString(),
            mode: this.mode,
        };
    }
    toString() {
        return `${super.toString()}-${this.operator.toString()}`;
    }
}
export class DelegateFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.NFT.DELEGATE.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate operator found in items"));
        this.items.forEach(it => Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return HINT.NFT.DELEGATE.OPERATION;
    }
}
//# sourceMappingURL=delegate.js.map