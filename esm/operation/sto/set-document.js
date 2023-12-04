import { ContractFact } from "../base";
import { HINT } from "../../alias";
export class SetDocumentFact extends ContractFact {
    title;
    uri;
    documentHash;
    constructor(token, sender, contract, title, uri, documentHash, currency) {
        super(HINT.STO.SET_DOCUMENT.FACT, token, sender, contract, currency);
        this.title = title;
        this.uri = uri;
        this.documentHash = documentHash;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.title),
            Buffer.from(this.uri),
            Buffer.from(this.documentHash),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            title: this.title,
            uri: this.uri,
            documenthash: this.documentHash,
        };
    }
    get operationHint() {
        return HINT.STO.SET_DOCUMENT.OPERATION;
    }
}
//# sourceMappingURL=set-document.js.map