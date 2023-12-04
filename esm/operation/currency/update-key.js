import { Fact } from "../base";
import { HINT } from "../../alias";
import { CurrencyID } from "../../common";
import { Address } from "../../key";
export class UpdateKeyFact extends Fact {
    target;
    keys;
    currency;
    constructor(token, target, keys, currency) {
        super(HINT.CURRENCY.UPDATE_KEY.FACT, token);
        this.target = Address.from(target);
        this.keys = keys;
        this.currency = CurrencyID.from(currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.target.toBuffer(),
            this.keys.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            target: this.target.toString(),
            keys: this.keys.toHintedObject(),
            currency: this.currency.toString(),
        };
    }
    get operationHint() {
        return HINT.CURRENCY.UPDATE_KEY.OPERATION;
    }
}
//# sourceMappingURL=update-key.js.map