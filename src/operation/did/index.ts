import { RegisterModelFact } from "./register-model"
import { CreateDidFact } from "./create-did"
import { ReactivateDidFact } from "./reactive-did"
import { DeactivateDidFact } from "./deactive-did"
import { ContractGenerator, Operation } from "../base"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { IP, TimeStamp as TS, URIString } from "../../types"
import { Assert, MitumError, ECODE } from "../../error"

export class DID extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }
    
    /**
     * Generate a `register-model` operation to register new did model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [didMethod] - The did method
     * @param {string | LongString} [docContext] - The context of did document
     * @param {string | LongString} [docAuthType] - The type of authentication of did document
     * @param {string | LongString} [docSvcType] - The type of service of did document
     * @param {string | LongString} [docSvcEndPoint] - The end point of service of did document
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(
        contract: string | Address,
        sender: string | Address,
        didMethod: string,
        docContext: string,
        docAuthType: string,
        docSvcType: string,
        docSvcEndPoint: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RegisterModelFact(
                TS.new().UTC(),
                sender,
                contract,
                didMethod,
                docContext,
                docAuthType,
                docSvcType,
                docSvcEndPoint,
                currency
            )
        )
    }
    
    /**
     * Generate `create-did` operation to create new did.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [publicKey] - The publicKey for the did to create. // Must be longer than 128 digits. If the length over 128, only the 128 characters from the end will be used.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-did` operation
     */
    create(
        contract: string | Address,
        sender: string | Address,
        publicKey: string,
        currency: string | CurrencyID,
    ) {
        const fact = new CreateDidFact(
            TS.new().UTC(),
            sender,
            contract,
            publicKey,
            currency,
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
        const fact = new ReactivateDidFact(
            TS.new().UTC(),
            sender,
            contract,
            did,
            currency,
        )

        return new Operation(this.networkID, fact)
    }

    /**
     * Get information for did model.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information of did model:
     * - `_hint`: hint for did model design,
     * - `didMethod`: The did method,
     * - `docContext`: The context of did,
     * - `docAuthType`: The type of authentication,
     * - `docSvcType`: The type of did service,
     * - `docSvcEndPoint`: The end point of did service
     */
    async getModelInfo(contract: string | Address) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.did.getModel(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get did data with publickey
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [publicKey] - The publicKey, // Must be longer than 128 digits. If the length over 128, only the 128 characters from the end will be used.
     * @returns `data` of `SuccessResponse` is did data:
     * - `_hint`: hint for did data,
     * - `publicKey`: The publickey with prefix '04',
     * - `did`: The did value,
     */
    async getByPubKey(
        contract: string | Address,
        publicKey: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(publicKey, 'publicKey');
        return await getAPIData(() => contractApi.did.getByPubKey(this.api, contract, publicKey, this.delegateIP))
    }

    /**
     * Get did document with certain did.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [did] - The did value.
     * @returns `data` of `SuccessResponse` is did document:
     * - `_hint`: Hint for did data,
     * - `did_doc`: object
     * - - `'@context'`: The context of did,
     * - - `id`: The did value,
     * - - `created`: The fact hash of create-did operation,
     * - - `status`: 0 means deactive, 1 means active,
     * - - `authentication`: object,
     * - - - `id`: The did value,
     * - - - `type`: The type of authentication
     * - - - `controller`: The did value
     * - - - `publicKeyHex`: The publickey used when did create, '04' is prefix
     * - - `service`: object
     * - - - `id`: The did value
     * - - - `type`: The type of did service,
     * - - - `service_end_point`: The end point of did service,
     */
    async getByDID(
        contract: string | Address,
        did: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.did.getByDID(
            this.api,
            contract,
            did,
            this.delegateIP,
        ))
    }
}