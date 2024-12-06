import { RegisterModelFact } from "./register-model"
import { CreateFact } from "./create-did"
import { ReactivateDidFact } from "./reactive-did"
import { DeactivateDidFact } from "./deactive-did"
import { UpdateDocumentFact } from "./update_did_document"
import { AsymKeyAuth, SocialLoginAuth, Document } from "./document"
import { ContractGenerator, Operation } from "../base"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { isSuccessResponse  } from "../../utils"
import { IP, TimeStamp as TS, LongString } from "../../types"
import { Assert, MitumError, ECODE } from "../../error"
import { Key } from "../../key"

type asymkeyAuth = {
    _hint: string,
    id: string | LongString,
    authType: "Ed25519VerificationKey2018" | "EcdsaSecp256k1VerificationKey2019",
    controller: string | LongString,
    publicKey: string | Key,
}

type socialLoginAuth = {
    _hint: string,
    id: string | LongString,
    authType: "VerifiableCredential",
    controller: string | LongString,
    serviceEndpoint: string | LongString,
    proof: {
        verificationMethod: string | LongString
    }
}

type document = {
    _hint: string,
    "@context": string | LongString,
    status: string,
    created: string,
    id: string | LongString, 
    authentication: (asymkeyAuth | socialLoginAuth)[],
    verificationMethod: [],
    service: {
        id: string | LongString,
        type: string | LongString,
        service_end_point: string | LongString
    }
}

const isOfType = <T>(obj: unknown, keys: (keyof T)[]): obj is T =>
    typeof obj === "object" && obj !== null && keys.every((key) => key in obj);

const validateAuthentication = (auth: unknown, index: number): void => {
    const baseKeys = ["_hint", "id", "authType", "controller"] as (keyof (asymkeyAuth | socialLoginAuth))[];
    
    if (!isOfType<asymkeyAuth | socialLoginAuth>(auth, baseKeys)) {
        throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, "Invalid authentication type");
    }
    if ((auth as asymkeyAuth).authType === "Ed25519VerificationKey2018" || (auth as asymkeyAuth).authType === "EcdsaSecp256k1VerificationKey2019") {
        const asymkeyAuthKeys = [...baseKeys, "publicKey"] as (keyof asymkeyAuth)[];
        if (!isOfType<asymkeyAuth>(auth, asymkeyAuthKeys)) {
            throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `Asymkey authentication at index ${index} is missing required fields.`);
        }
    }

    else if ((auth as socialLoginAuth).authType === "VerifiableCredential") {
        const socialLoginAuthKeys = [...baseKeys, "serviceEndpoint", "proof"] as (keyof socialLoginAuth)[];
        if (!isOfType<socialLoginAuth>(auth, socialLoginAuthKeys)) {
            throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `Social login authentication at index ${index} is missing required fields.`);
        }

        if (!auth.proof || typeof auth.proof !== "object") {
            throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `Proof in social login authentication at index ${index} is invalid or missing.`);
        }

        const proofKeys = ["verificationMethod"] as (keyof socialLoginAuth["proof"])[];
        if (!isOfType<socialLoginAuth["proof"]>(auth.proof, proofKeys)) {
            throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `Proof in social login authentication at index ${index} is missing required fields.`);
        }
    }

    else {
        throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `Unknown authentication type at index ${index}.`);
    }
};

export class DID extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    private validateDocument(doc: unknown): void {
        if (typeof doc !== "object" || doc === null) {
            throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "invalid document type")
        }
    
        const requiredKeys = ["_hint", "@context", "status", "created", "id", "authentication", "verificationMethod", "service"] as (keyof document)[];
        if (!isOfType<document>(doc, requiredKeys)) {
            throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "The document structure is invalid or missing required fields.");
        }
    
        if (!Array.isArray(doc.authentication)) {
            throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, "The 'authentication' field must be an array.");
        }
    
        doc.authentication.forEach((auth, index) => validateAuthentication(auth, index));
    
        const serviceKeys = ["id", "type", "service_end_point"] as (keyof document["service"])[];
        if (!isOfType<document["service"]>(doc.service, serviceKeys)) {
            throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "The 'service' structure is invalid or missing required fields.");
        }
    }

    private validateDID(did:string, option?:boolean): void {
        const parts = did.split(":");
        if (parts.length !== 3) {
            throw MitumError.detail(ECODE.DID.INVALID_DID, "Invalid did structure");
        }
   
        if (parts[0] !== "did") {
            throw MitumError.detail(ECODE.DID.INVALID_DID, "Invalid did structure");
        }

        if (option) {
            const subparts = parts[2].split("#");
            if (subparts.length !== 2) {
                throw MitumError.detail(ECODE.DID.INVALID_DID, "Invalid authentication id");
            } else {
                Address.from(subparts[0]);
            }
        } else {
            Address.from(parts[2]);
        }

        if (option && (did.match(/#/g) || []).length !== 1) {
            throw MitumError.detail(ECODE.DID.INVALID_DID, "Invalid authentication id");
        }
    }

    writeAsymkeyAuth(
        id: string,
        authType: "Ed25519VerificationKey2018" | "EcdsaSecp256k1VerificationKey2019",
        controller: string,
        publicKey: string,
    ) {
        return new AsymKeyAuth(id, authType, controller, publicKey)
    };

    writeSocialLoginAuth(
        id: string,
        controller: string,
        serviceEndpoint: string,
        verificationMethod: string,
    ) {
        return new SocialLoginAuth(id, controller, serviceEndpoint, verificationMethod)
    };

    writeDocument(
        didContext: string,
        status: string,
        created: string,
        didID: string,
        authentications: (SocialLoginAuth | AsymKeyAuth)[],
        serivceID: string,
        serviceType: string,
        serviceEndPoint: string
    ) {
        return new Document(
            didContext,
            status,
            created,
            didID,
            authentications,
            [],
            serivceID,
            serviceType,
            serviceEndPoint
        )
    };
    
    /**
     * Generate a `register-model` operation to register new did registry model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [didMethod] - The did method
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(
        contract: string | Address,
        sender: string | Address,
        didMethod: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RegisterModelFact(
                TS.new().UTC(),
                sender,
                contract,
                didMethod,
                currency
            )
        )
    }
    
    /**
     * Generate `create-did` operation to create new did and did document.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {"ECDSA"} [authType] - The encryption method to use for authentication.
     * @param {publicKey} [publicKey] - The public key to use for authentication.
     * @param {serviceType} [serviceType] - The serivce type.
     * @param {serviceEndpoints} [serviceEndpoints] - The service end point.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-did` operation
     */
    create(
        contract: string | Address,
        sender: string | Address,
        authType: "ECDSA", //"ECDSA" | "EdDSA"
        publicKey: string,
        serviceType: string,
        serviceEndpoints: string,
        currency: string | CurrencyID,
    ) {
        const fact = new CreateFact(
            TS.new().UTC(),
            sender,
            contract,
            authType,
            publicKey,
            serviceType,
            serviceEndpoints,
            currency
        )
        return new Operation(this.networkID, fact)
    }

    /**
     * Generate `deactivate-did` operation to deactivate the did.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [did] - The did to deactivate.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `deactivate-did` operation
     */
    deactivate(
        contract: string | Address,
        sender: string | Address,
        did: string,
        currency: string | CurrencyID,
    ) {
        this.validateDID(did);
        const fact = new DeactivateDidFact(
            TS.new().UTC(),
            sender,
            contract,
            did,
            currency,
        )

        return new Operation(this.networkID, fact)
    }

    /**
     * Generate `reactivate-did` operation to reactivate the did.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [did] - The did to reactivate.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `reactivate-did` operation
     */
    reactivate(
        contract: string | Address,
        sender: string | Address,
        did: string,
        currency: string | CurrencyID,
    ) {
        this.validateDID(did);
        const fact = new ReactivateDidFact(
            TS.new().UTC(),
            sender,
            contract,
            did,
            currency,
        )

        return new Operation(this.networkID, fact)
    }

    updateDIDDocument(
        contract: string | Address,
        sender: string | Address,
        document: document,
        currency: string | CurrencyID,
    ) {
        this.validateDocument(document);
        this.validateDID(document.id.toString());
        this.validateDID(document.service.id.toString());
        const fact = new UpdateDocumentFact(
            TS.new().UTC(),
            sender,
            contract,
            document.id.toString(),
            new Document(
                document["@context"],
                document.status,
                document.created,
                document.id,
                document.authentication.map((el) => {
                    this.validateDID(el.id.toString(), true);
                    if ("proof" in el) {
                        return new SocialLoginAuth(el.id, el.controller, el.serviceEndpoint, el.proof.verificationMethod)
                    } else {
                        return new AsymKeyAuth(el.id, el.authType, el.controller, el.publicKey)
                    }
                }),
                document.verificationMethod,
                document.service.id,
                document.service.type,
                document.service.service_end_point
            ),
            currency
        )
        return new Operation(this.networkID, fact)
    }

    /**
     * Get information for did-registry model.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information of did model:
     * - `_hint`: hint for did model design,
     * - `didMethod`: The did method
     */
    async getModelInfo(contract: string | Address) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.did.getModel(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get did by account address.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [account] - The account address.
     * @returns `data` of `SuccessResponse` is did:
     * - `did`: The did value,
     */
    async getDIDByAddress(
        contract: string | Address,
        account: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Address.from(account);
        const response = await getAPIData(() => contractApi.did.getByAccount(this.api, contract, account, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.did ? {did: response.data.did} : null;
        }
        return response
    }

    /**
     * Get did document by did.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [did] - The did value.
     * @returns `data` of `SuccessResponse` is did document:
     * - `did_document`: object
     * - - `'@context'`: The context of did,
     * - - `id`: The did value,
     * - - `created`: The fact hash of create-did operation,
     * - - `status`: 0 means deactive, 1 means active,
     * - - `authentication`: object,
     * - - - `id`: The did value,
     * - - - `type`: The type of authentication
     * - - - `controller`: The did value
     * - - - `publicKey`: The publickey used when did create,
     * - - `service`: object
     * - - - `id`: The did value
     * - - - `type`: The type of did service,
     * - - - `service_end_point`: The end point of did service,
     */
    async getDDocByDID(
        contract: string | Address,
        did: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        this.validateDID(did);
        const response = await getAPIData(() => contractApi.did.getByDID(
            this.api,
            contract,
            did,
            this.delegateIP,
        ))
        return response
    }
}