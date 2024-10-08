import { RegisterModelFact } from "./register-model"
import { CreateDataFact } from "./create-data"
import { ContractGenerator, Operation } from "../base"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { IP, TimeStamp as TS, URIString, LongString } from "../../types"
import { Assert, MitumError, ECODE } from "../../error"

export class Dmile extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }
    
    /**
     * Generate a `register-model` operation to register new dmile model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [project] - The project's name
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(
        contract: string | Address,
        sender: string | Address,
        project: string | LongString,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RegisterModelFact(
                TS.new().UTC(),
                sender,
                contract,
                project,
                currency,
            )
        )
    }
    
    /**
     * Generate `create-data` operation to create data with new merkle root on the dmile model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [merkleRoot] - Value of the merkle root to record.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-data` operation
     */
    createData(
        contract: string | Address,
        sender: string | Address,
        merkleRoot: string | LongString,
        currency: string | CurrencyID,
    ) {
        new URIString(merkleRoot.toString(), 'merkleRoot');
        const fact = new CreateDataFact(
            TS.new().UTC(),
            sender,
            contract,
            merkleRoot,
            currency,
        )

        return new Operation(this.networkID, fact)
    }
    
    /**
     * Get information about a dmile model on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the dmile service:
     * - `_hint`: Hint for dmile design,
     * - `project`: Project's name
     */
    async getModelInfo(contract: string | Address) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.dmile.getModel(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get tx id by merkle root.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [merkleRoot] - The value of merkle root.
     * @returns `data` of `SuccessResponse` is information about the data with certain merkle root on the project:
     * - `_hint`: Hint for d-mile data,
     * - `merkleRoot`: The merkle root value,
     * - `txid`: The id of create-data transaction,
     */
    async getByMerkleRoot(
        contract: string | Address,
        merkleRoot: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(merkleRoot, 'merkleRoot');
        return await getAPIData(() => contractApi.dmile.getByMerkleRoot(this.api, contract, merkleRoot, this.delegateIP))
    }

    /**
     * Get mekle root by tx id.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [txId] - The Id of create-data transaction.
     * @returns `data` of `SuccessResponse` is an array of the history information about the data:
     * - `_hint`: Hint for d-mile data,
     * - `merkleRoot`: The merkle root value,
     * - `txid`: The id of create-data transaction,
     */
    async getByTxId(
        contract: string | Address,
        txId: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(txId, 'txId');
        return await getAPIData(() => contractApi.dmile.getByTxId(
            this.api,
            contract,
            txId,
            this.delegateIP,
        ))
    }
}