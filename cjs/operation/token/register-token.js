"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterTokenFact = void 0;
const fact_1 = require("./fact");
const alias_1 = require("../../alias");
const common_1 = require("../../common");
const types_1 = require("../../types");
const error_1 = require("../../error");
class RegisterTokenFact extends fact_1.TokenFact {
    constructor(token, sender, contract, currency, symbol, name, initialSupply) {
        super(alias_1.HINT.TOKEN.REGISTER_TOKEN.FACT, token, sender, contract, currency);
        this.symbol = common_1.CurrencyID.from(symbol);
        this.name = types_1.LongString.from(name);
        this.initialSupply = types_1.Big.from(initialSupply);
        error_1.Assert.check(this.initialSupply.compare(0) > 0, error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "initialSupply under zero"));
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
        return Object.assign(Object.assign({}, super.toHintedObject()), { symbol: this.symbol.toString(), name: this.name.toString(), initial_supply: this.initialSupply.toString() });
    }
    get operationHint() {
        return alias_1.HINT.TOKEN.REGISTER_TOKEN.OPERATION;
    }
}
exports.RegisterTokenFact = RegisterTokenFact;
//# sourceMappingURL=register-token.js.map