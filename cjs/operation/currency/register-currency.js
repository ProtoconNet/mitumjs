"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCurrencyFact = void 0;
const base_1 = require("../base");
const alias_1 = require("../../alias");
class RegisterCurrencyFact extends base_1.NodeFact {
    constructor(token, design) {
        super(alias_1.HINT.CURRENCY.REGISTER_CURRENCY.FACT, token);
        this.design = design;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            this.token.toBuffer(),
            this.design.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { currency: this.design.toHintedObject() });
    }
    get operationHint() {
        return alias_1.HINT.CURRENCY.REGISTER_CURRENCY.OPERATION;
    }
}
exports.RegisterCurrencyFact = RegisterCurrencyFact;
//# sourceMappingURL=register-currency.js.map