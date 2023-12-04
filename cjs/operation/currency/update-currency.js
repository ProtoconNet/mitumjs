"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCurrencyFact = void 0;
const base_1 = require("../base");
const alias_1 = require("../../alias");
const common_1 = require("../../common");
class UpdateCurrencyFact extends base_1.NodeFact {
    constructor(token, currency, policy) {
        super(alias_1.HINT.CURRENCY.UPDATE_CURRENCY.FACT, token);
        this.currency = common_1.CurrencyID.from(currency);
        this.policy = policy;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
            this.policy.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { currency: this.currency.toString(), policy: this.policy.toHintedObject() });
    }
    get operationHint() {
        return alias_1.HINT.CURRENCY.UPDATE_CURRENCY.OPERATION;
    }
}
exports.UpdateCurrencyFact = UpdateCurrencyFact;
//# sourceMappingURL=update-currency.js.map