import { Fact } from "../base";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { SortFunc } from "../../utils";
import { CurrencyID } from "../../common";
export class UpdateOperatorFact extends Fact {
    sender;
    contract;
    operators;
    currency;
    constructor(token, sender, contract, currency, operators) {
        super(HINT.CURRENCY.UPDATE_OPERATOR.FACT, token);
        this.sender = Address.from(sender);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
        this.operators = operators.map(a => Address.from(a));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.operators.sort(SortFunc).map(a => a.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            contract: this.contract.toString(),
            currency: this.currency.toString(),
            operators: this.operators.sort(SortFunc).map((w) => w.toString()),
        };
    }
    get operationHint() {
        return HINT.CURRENCY.UPDATE_OPERATOR.OPERATION;
    }
}
//# sourceMappingURL=update-operator.js.map