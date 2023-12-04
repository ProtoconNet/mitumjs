import { HINT } from "../../alias";
import { ContractFact } from "../base";
export class CreateServiceFact extends ContractFact {
    constructor(token, sender, contract, currency) {
        super(HINT.CREDENTIAL.CREATE_SERVICE.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.CREDENTIAL.CREATE_SERVICE.OPERATION;
    }
}
//# sourceMappingURL=create-service.js.map