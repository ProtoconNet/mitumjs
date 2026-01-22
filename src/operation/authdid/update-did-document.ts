import { HINT } from "../../alias"
import { Address } from "../../key"
import { LongString } from "../../types"
import { CurrencyID } from "../../common"
import { ContractFact, FactJson } from "../base"
import { Document } from "./document"

export class UpdateDocumentFact extends ContractFact {
    readonly did: LongString;
    readonly document: Document;

    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address,
        did: string,
        document: Document,
        currency: string | CurrencyID,
    ) {
        super(HINT.AUTH_DID.UPDATE_DID_DOCUMENT.FACT, token, sender, contract, currency);
        
        this.did = LongString.from(did);
        this.document = document;
        this._hash = this.hashing();
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.did.toBuffer(),
            this.document.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            did: this.did.toString(),
            document: this.document.toHintedObject(),
        }
    }

    get operationHint() {
        return HINT.AUTH_DID.UPDATE_DID_DOCUMENT.OPERATION
    }
}

