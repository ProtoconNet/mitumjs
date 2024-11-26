import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { ContractFact, FactJson } from "../base"
import { Document } from "./document"
// import { Config } from "../../node"
// import { Assert, ECODE, MitumError } from "../../error"


export class CreateFact extends ContractFact {
    readonly document: Document;
    readonly address: Address;

    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address,
        address: string | Address,
        document: Document,
        currency: string | CurrencyID,
    ) {
        super(HINT.DID.CREATE_DID.FACT, token, sender, contract, currency);
        this.address = Address.from(address);
        this.document = document;
        this._hash = this.hashing();
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.address.toBuffer(),
            this.document.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            address: this.address.toString(),
            document: this.document.toHintedObject(),
        }
    }

    get operationHint() {
        return HINT.DID.CREATE_DID.OPERATION
    }
}