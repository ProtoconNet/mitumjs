import { NodeFact } from "../types/fact";
import { HINT } from "../types/hint";
export class CurrencyRegisterFact extends NodeFact {
    constructor(token, design) {
        super(HINT.CURRENCY_REGISTER_OPERATION_FACT, token);
        this.design = design;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([this.token.toBuffer(), this.design.toBuffer()]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { currency: this.design.toHintedObject() });
    }
    get operationHint() {
        return HINT.CURRENCY_REGISTER_OPERATION;
    }
}
//# sourceMappingURL=register.js.map