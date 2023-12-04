import { Hint } from "./hint";
import { CurrencyID } from "./id";
import { HINT } from "../alias";
import { Assert, ECODE, MitumError } from "../error";
import { Big } from "../types";
export class Amount {
    hint;
    currency;
    big;
    constructor(currency, big) {
        this.hint = new Hint(HINT.CURRENCY.AMOUNT);
        this.currency = CurrencyID.from(currency);
        this.big = Big.from(big);
        Assert.check(0 < this.big.big, MitumError.detail(ECODE.INVALID_AMOUNT, "zero big"));
    }
    toBuffer() {
        return Buffer.concat([
            this.big.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            currency: this.currency.toString(),
            amount: this.big.toString(),
        };
    }
}
//# sourceMappingURL=amount.js.map