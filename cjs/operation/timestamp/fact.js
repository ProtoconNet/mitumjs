"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeStampFact = void 0;
const base_1 = require("../base");
class TimeStampFact extends base_1.ContractFact {
    constructor(hint, token, sender, target, currency) {
        super(hint, token, sender, target, currency);
        // this._hash = this.hashing()
    }
    toHintedObject() {
        const fact = super.toHintedObject();
        delete fact['contract'];
        return Object.assign(Object.assign({}, fact), { target: this.contract.toString() });
    }
}
exports.TimeStampFact = TimeStampFact;
//# sourceMappingURL=fact.js.map