"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceFact = void 0;
const alias_1 = require("../../alias");
const base_1 = require("../base");
class CreateServiceFact extends base_1.ContractFact {
    constructor(token, sender, contract, currency) {
        super(alias_1.HINT.CREDENTIAL.CREATE_SERVICE.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return alias_1.HINT.CREDENTIAL.CREATE_SERVICE.OPERATION;
    }
}
exports.CreateServiceFact = CreateServiceFact;
//# sourceMappingURL=create-service.js.map