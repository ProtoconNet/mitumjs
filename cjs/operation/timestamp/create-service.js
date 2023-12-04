"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceFact = void 0;
const fact_1 = require("./fact");
const alias_1 = require("../../alias");
class CreateServiceFact extends fact_1.TimeStampFact {
    constructor(token, sender, target, currency) {
        super(alias_1.HINT.TIMESTAMP.CREATE_SERVICE.FACT, token, sender, target, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return alias_1.HINT.TIMESTAMP.CREATE_SERVICE.OPERATION;
    }
}
exports.CreateServiceFact = CreateServiceFact;
//# sourceMappingURL=create-service.js.map