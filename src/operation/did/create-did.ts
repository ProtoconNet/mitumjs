import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { ContractFact, FactJson } from "../base"
import { LongString } from "../../types"
// import { Config } from "../../node"


export class CreateFact extends ContractFact {
    readonly authType: LongString;
    readonly publicKey: LongString;
    readonly serviceType: LongString;
    readonly serviceEndpoints: LongString;

    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address,
        authType: "EcdsaSecp256k1VerificationKey2019" | "Ed25519VerificationKey2018",
        publicKey: string,
        serviceType: string,
        serviceEndpoints: string,
        currency: string | CurrencyID,
    ) {
        super(HINT.DID.CREATE_DID.FACT, token, sender, contract, currency);
        this.authType = LongString.from(authType);
        this.publicKey = LongString.from(publicKey);
        this.serviceType = LongString.from(serviceType);
        this.serviceEndpoints = LongString.from(serviceEndpoints);
        
        this._hash = this.hashing();
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.authType.toBuffer(),
            this.publicKey.toBuffer(),
            this.serviceType.toBuffer(),
            this.serviceEndpoints.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            authType: this.authType.toString(),
            publicKey: this.publicKey.toString(),
            serviceType: this.serviceType.toString(),
            serviceEndpoints: this.serviceEndpoints.toString()
        }
    }

    get operationHint() {
        return HINT.DID.CREATE_DID.OPERATION
    }
}