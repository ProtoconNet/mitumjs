"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKeyFact = void 0;
const base_1 = require("../base");
const alias_1 = require("../../alias");
const common_1 = require("../../common");
const key_1 = require("../../key");
class UpdateKeyFact extends base_1.Fact {
    constructor(token, target, keys, currency) {
        super(alias_1.HINT.CURRENCY.UPDATE_KEY.FACT, token);
        this.target = key_1.Address.from(target);
        this.keys = keys;
        this.currency = common_1.CurrencyID.from(currency);
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
        return Object.assign(Object.assign({}, super.toHintedObject()), { target: this.target.toString(), keys: this.keys.toHintedObject(), currency: this.currency.toString() });
    }
    get operationHint() {
        return alias_1.HINT.CURRENCY.UPDATE_KEY.OPERATION;
    }
}
exports.UpdateKeyFact = UpdateKeyFact;
//# sourceMappingURL=update-key.js.map