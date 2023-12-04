import { TimeStampFact } from "./fact";
import { HINT } from "../../alias";
export class CreateServiceFact extends TimeStampFact {
    constructor(token, sender, target, currency) {
        super(HINT.TIMESTAMP.CREATE_SERVICE.FACT, token, sender, target, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.TIMESTAMP.CREATE_SERVICE.OPERATION;
    }
}
//# sourceMappingURL=create-service.js.map