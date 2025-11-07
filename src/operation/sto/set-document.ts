import { ContractFact, FactJson } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key/address"
import { CurrencyID } from "../../common"

export class SetDocumentFact extends ContractFact {
    readonly title: string
    readonly uri: string
    readonly documentHash: string

    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address, 
        title: string,
        uri: string,
        documentHash: string,
        currency: string | CurrencyID,
    ) {
        super(HINT.STO.SET_DOCUMENT.FACT, token, sender, contract, currency)

        this.title = title
        this.uri = uri
        this.documentHash = documentHash

        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.title),
            Buffer.from(this.uri),
            Buffer.from(this.documentHash),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            title: this.title,
            uri: this.uri,
            documenthash: this.documentHash,
        }
    }

    get operationHint() {
        return HINT.STO.SET_DOCUMENT.OPERATION
    }
}