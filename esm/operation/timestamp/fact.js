import { ContractFact } from "../base";
export class TimeStampFact extends ContractFact {
    constructor(hint, token, sender, target, currency) {
        super(hint, token, sender, target, currency);
        // this._hash = this.hashing()
    }
    toHintedObject() {
        const fact = super.toHintedObject();
        delete fact['contract'];
        return {
            ...fact,
            target: this.contract.toString(),
        };
    }
}
//# sourceMappingURL=fact.js.map