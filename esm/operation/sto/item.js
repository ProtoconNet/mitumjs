import { Item } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
export class STOItem extends Item {
    contract;
    currency;
    constructor(hint, contract, currency) {
        super(hint);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
    }
    toBuffer() {
        return this.contract.toBuffer();
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            currency: this.currency.toString(),
        };
    }
    toString() {
        return this.contract.toString();
    }
}
//# sourceMappingURL=item.js.map