import { RegisterModelFact } from "./register-model"
import { CreateFact } from "./create-did"
import { UpdateDocumentFact } from "./update_did_document"
import { AsymKeyAuth, SocialLoginAuth, Document } from "./document"
import { ContractGenerator, Operation } from "../base"
import { Address, Key } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { isSuccessResponse  } from "../../utils"
import { validateDID } from "../../utils/typeGuard"
import { IP, TimeStamp as TS, LongString } from "../../types"
import { Assert, MitumError, ECODE } from "../../error"

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
        throw MitumError.detail(ECODE.AUTH_DID.INVALID_AUTHENTICATION, "Invalid authentication type");
    }
    if ((auth as asymkeyAuth).authType === "Ed25519VerificationKey2018" || (auth as asymkeyAuth).authType === "EcdsaSecp256k1VerificationKey2019") {
        const asymkeyAuthKeys = [...baseKeys, "publicKey"] as (keyof asymkeyAuth)[];
        if (!isOfType<asymkeyAuth>(auth, asymkeyAuthKeys)) {
            throw MitumError.detail(ECODE.AUTH_DID.INVALID_AUTHENTICATION, `Asymkey authentication at index ${index} is missing required fields.`);
        }
    }

    else if ((auth as socialLoginAuth).authType === "VerifiableCredential") {
        const socialLoginAuthKeys = [...baseKeys, "serviceEndpoint", "proof"] as (keyof socialLoginAuth)[];
        if (!isOfType<socialLoginAuth>(auth, socialLoginAuthKeys)) {
            throw MitumError.detail(ECODE.AUTH_DID.INVALID_AUTHENTICATION, `Social login authentication at index ${index} is missing required fields.`);
        }

        if (!auth.proof || typeof auth.proof !== "object") {
            throw MitumError.detail(ECODE.AUTH_DID.INVALID_AUTHENTICATION, `Proof in social login authentication at index ${index} is invalid or missing.`);
        }

        const proofKeys = ["verificationMethod"] as (keyof socialLoginAuth["proof"])[];
        if (!isOfType<socialLoginAuth["proof"]>(auth.proof, proofKeys)) {
            throw MitumError.detail(ECODE.AUTH_DID.INVALID_AUTHENTICATION, `Proof in social login authentication at index ${index} is missing required fields.`);
        }
    }

    else {
        throw MitumError.detail(ECODE.AUTH_DID.INVALID_AUTHENTICATION, `Unknown authentication type at index ${index}.`);
    }
};

export class AuthDID extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    private validateDocument(doc: unknown): void {
        if (typeof doc !== "object" || doc === null) {
            throw MitumError.detail(ECODE.AUTH_DID.INVALID_DOCUMENT, "invalid document type")
        }
    
        const requiredKeys = ["_hint", "@context", "id", "authentication", "verificationMethod", "service"] as (keyof document)[];
        if (!isOfType<document>(doc, requiredKeys)) {
            throw MitumError.detail(ECODE.AUTH_DID.INVALID_DOCUMENT, "The document structure is invalid or missing required fields.");
        }
    
        if (!Array.isArray(doc.authentication)) {
            throw MitumError.detail(ECODE.AUTH_DID.INVALID_AUTHENTICATION, "The 'authentication' field must be an array.");
        }
    
        doc.authentication.forEach((auth, index) => validateAuthentication(auth, index));
    
        const serviceKeys = ["id", "type", "service_end_point"] as (keyof document["service"])[];
        if (!isOfType<document["service"]>(doc.service, serviceKeys)) {
            throw MitumError.detail(ECODE.AUTH_DID.INVALID_DOCUMENT, "The 'service' structure is invalid or missing required fields.");
        }
    }

    private isSenderDidOwner(sender: string | Address, did: string | LongString, id?: true) {
        Assert.check(
            sender.toString() === validateDID(did.toString(), id).toString(),
            MitumError.detail(ECODE.AUTH_DID.INVALID_DID, `The owner of did must match the sender(${sender.toString()}). check the did (${did.toString()})`)
        );
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
        didID: string,
        authentications: (SocialLoginAuth | AsymKeyAuth)[],
        serivceID: string,
        serviceType: string,
        serviceEndPoint: string
    ) {
        return new Document(
            didContext,
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
     * Generate `update-did-document` operation to update the did document.
     * `document` must comply with document type
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {document} [document] - The did document to be updated.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-did-document` operation
     */
    updateDocument(
        contract: string | Address,
        sender: string | Address,
        document: document,
        currency: string | CurrencyID,
    ) {
        this.validateDocument(document);
        this.isSenderDidOwner(sender, document.id);
        this.isSenderDidOwner(sender, document.service.id);

        const fact = new UpdateDocumentFact(
            TS.new().UTC(),
            sender,
            contract,
            document.id.toString(),
            new Document(
                document["@context"],
                document.id,
                document.authentication.map((el) => {
                    this.isSenderDidOwner(sender, el.id, true);
                    this.isSenderDidOwner(sender, el.controller);
                    if ("proof" in el) {
                        validateDID(el.proof.verificationMethod.toString(), true);
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
        return await getAPIData(() => contractApi.authdid.getModel(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get did by account address.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [account] - The account address.
     * @returns `data` of `SuccessResponse` is did:
     * - `did`: The did value,
     */
    async getDID(
        contract: string | Address,
        account: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Address.from(account);
        const response = await getAPIData(() => contractApi.authdid.getByAccount(this.api, contract, account, this.delegateIP));
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
    async getDocument(
        contract: string | Address,
        did: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        validateDID(did);
        const response = await getAPIData(() => contractApi.authdid.getByDID(
            this.api,
            contract,
            did,
            this.delegateIP,
        ))
        return response
    }
}