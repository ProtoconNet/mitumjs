import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { ContractFact, FactJson } from "../base"
import { LongString } from "../../types"
import { MitumError, ECODE } from "../../error"
import { Key } from "../../key"


export class CreateFact extends ContractFact {
    readonly authType: LongString;
    readonly publicKey: Key;
    readonly serviceType: LongString;
    readonly serviceEndpoints: LongString;

    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address,
        authType: "ECDSA" | "EdDSA",
        publicKey: string,
        serviceType: string,
        serviceEndpoints: string,
        currency: string | CurrencyID,
    ) {
        super(HINT.AUTH_DID.CREATE_DID.FACT, token, sender, contract, currency);
        if (authType === "ECDSA") {
            this.authType = LongString.from("EcdsaSecp256k1VerificationKey2019");
        } else if (authType === "EdDSA") {
            this.authType = LongString.from("Ed25519VerificationKey2018");
        } else {
            throw MitumError.detail(ECODE.INVALID_FACT, "invalid authType");
        }
        
        this.publicKey = Key.from(publicKey);
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
        return HINT.AUTH_DID.CREATE_DID.OPERATION
    }
}