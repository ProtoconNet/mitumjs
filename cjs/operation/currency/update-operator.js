"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOperatorFact = void 0;
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const utils_1 = require("../../utils");
const common_1 = require("../../common");
class UpdateOperatorFact extends base_1.Fact {
    constructor(token, sender, contract, currency, operators) {
        super(alias_1.HINT.CURRENCY.UPDATE_OPERATOR.FACT, token);
        this.sender = key_1.Address.from(sender);
        this.contract = key_1.Address.from(contract);
        this.currency = common_1.CurrencyID.from(currency);
        this.operators = operators.map(a => key_1.Address.from(a));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.operators.sort(utils_1.SortFunc).map(a => a.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), contract: this.contract.toString(), currency: this.currency.toString(), operators: this.operators.sort(utils_1.SortFunc).map((w) => w.toString()) });
    }
    get operationHint() {
        return alias_1.HINT.CURRENCY.UPDATE_OPERATOR.OPERATION;
    }
}
exports.UpdateOperatorFact = UpdateOperatorFact;
//# sourceMappingURL=update-operator.js.map