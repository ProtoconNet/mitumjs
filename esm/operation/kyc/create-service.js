import { ContractFact } from "../base";
import { HINT } from "../../alias";
export class CreateServiceFact extends ContractFact {
    constructor(token, sender, contract, currency) {
        super(HINT.KYC.CREATE_SERVICE.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.KYC.CREATE_SERVICE.OPERATION;
    }
}
//# sourceMappingURL=create-service.js.map