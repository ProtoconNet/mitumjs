import { TokenFact } from "./fact";
import { HINT } from "../../alias";
import { CurrencyID } from "../../common";
import { Big, LongString } from "../../types";
import { Assert, ECODE, MitumError } from "../../error";
export class RegisterTokenFact extends TokenFact {
    symbol;
    name;
    initialSupply;
    constructor(token, sender, contract, currency, symbol, name, initialSupply) {
        super(HINT.TOKEN.REGISTER_TOKEN.FACT, token, sender, contract, currency);
        this.symbol = CurrencyID.from(symbol);
        this.name = LongString.from(name);
        this.initialSupply = Big.from(initialSupply);
        Assert.check(this.initialSupply.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "initialSupply under zero"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.symbol.toBuffer(),
            this.name.toBuffer(),
            this.initialSupply.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            symbol: this.symbol.toString(),
            name: this.name.toString(),
            initial_supply: this.initialSupply.toString(),
        };
    }
    get operationHint() {
        return HINT.TOKEN.REGISTER_TOKEN.OPERATION;
    }
}
//# sourceMappingURL=register-token.js.map