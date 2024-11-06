import { HINT } from "../../alias"
// import { Address } from "../../key"
import { Hint } from "../../common"
import { HintedObject, IBuffer, IHintedObject, LongString } from "../../types"
// import { Config } from "../../node"
// import { Assert, ECODE, MitumError } from "../../error"

abstract class Authentication implements IBuffer, IHintedObject {
    private hint: Hint

    constructor(hint: string) {
        this.hint = new Hint(hint)
    }

    toBuffer(): Buffer {
        return Buffer.from([])
    }

    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString(),
        }
    }
}

export class AsymKeyAuth extends Authentication {
    readonly id: LongString;
    readonly authType: "Ed25519VerificationKey2018" | "EcdsaSecp256k1VerificationKey2019";
    readonly controller: LongString;
    readonly publicKeyHex: LongString;

    constructor(
        id: string | LongString, 
        authType: "Ed25519VerificationKey2018" | "EcdsaSecp256k1VerificationKey2019", 
        controller: string | LongString,
        publicKeyHex: string | LongString
    ) {
        super(HINT.DID.AUTHENTICATION.ASYMMETRIC_KEY);
        this.id = LongString.from(id);
        this.authType = authType;
        this.controller = LongString.from(controller);
        this.publicKeyHex = LongString.from(publicKeyHex);
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.id.toBuffer(),
            Buffer.from(this.authType),
            this.controller.toBuffer(),
            this.publicKeyHex.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            id: this.id.toString(),
            authType: this.authType.toString(),
            controller: this.controller.toString(),
            publicKeyHex: this.publicKeyHex.toString(),
        }
    }
}

export class SocialLoginAuth extends Authentication {
    readonly id: LongString;
    readonly authType: "VerifiableCredential";
    readonly controller: LongString;
    readonly serviceEndpoint: LongString;
    readonly proofMethod: LongString;

    constructor(
        id: string | LongString, 
        //authType: "VerifiableCredential", 
        controller: string | LongString,
        serviceEndpoint: string | LongString,
        proofMethod: string | LongString
    ) {
        super(HINT.DID.AUTHENTICATION.SOCIAL_LOGIN);
        this.id = LongString.from(id);
        this.authType = "VerifiableCredential";
        this.controller = LongString.from(controller);
        this.serviceEndpoint = LongString.from(serviceEndpoint);
        this.proofMethod = LongString.from(proofMethod);
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.id.toBuffer(),
            Buffer.from(this.authType),
            this.controller.toBuffer(),
            this.serviceEndpoint.toBuffer(),
            this.proofMethod.toBuffer()
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            id: this.id.toString(),
            authType: this.authType.toString(),
            controller: this.controller.toString(),
            serviceEndpoint: this.serviceEndpoint.toString(),
            proof: {
                verificationMethod: this.proofMethod.toString()
            }
        }
    }
}

export class Service implements IBuffer, IHintedObject {
    readonly id: LongString;
    readonly type: LongString;
    readonly service_end_point: LongString;

    constructor(
        id: string | LongString,
        type: string | LongString,
        service_end_point: string | LongString
    ) {
        this.id = LongString.from(id);
        this.type = LongString.from(type);
        this.service_end_point = LongString.from(service_end_point);
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.id.toBuffer(),
            this.type.toBuffer(),
            this.service_end_point.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            id: this.id.toString(),
            type: this.type.toString(),
            service_end_point: this.service_end_point.toString(),
        }
    }
}

export class Document implements IBuffer, IHintedObject {
    private hint: Hint;
    readonly context: LongString;
    readonly id: LongString;
    readonly created: LongString;
    readonly status: LongString;
    readonly authentication: (AsymKeyAuth | SocialLoginAuth)[];
    readonly verificationMethod: [];
    readonly service_id: LongString;
    readonly service_type: LongString;
    readonly service_end_point: LongString;
    
    constructor(
        context: string | LongString, 
        id: string | LongString, 
        created: string | LongString,
        status: string | LongString,
        authentication : (AsymKeyAuth | SocialLoginAuth)[],
        verificationMethod : [],
        service_id: string | LongString,
        service_type: string | LongString,
        service_end_point: string | LongString
    ) {
        this.hint = new Hint(HINT.DID.DOCUMENT);
        this.context = LongString.from(context);
        this.id = LongString.from(id);
        this.created = LongString.from(created);
        this.status = LongString.from(status);
        this.authentication = authentication;
        this.verificationMethod = verificationMethod;
        this.service_id = LongString.from(service_id);
        this.service_type = LongString.from(service_type);
        this.service_end_point = LongString.from(service_end_point);
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.context.toBuffer(),
            this.id.toBuffer(),
            this.created.toBuffer(),
            this.status.toBuffer(),
            Buffer.concat(this.authentication.map(el => el.toBuffer())),
            this.service_id.toBuffer(),
            this.service_type.toBuffer(),
            this.service_end_point.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString(),
            "@context": this.context.toString(),
            id: this.id.toString(),
            created: this.created.toString(),
            status: this.status.toString(),
            authentication: this.authentication.map(el => el.toHintedObject()),
            verificationMethod: [],
            service: {
                id: this.service_id.toString(),
                type: this.service_type.toString(),
                service_end_point: this.service_end_point.toString(),
            }
        }
    }
}