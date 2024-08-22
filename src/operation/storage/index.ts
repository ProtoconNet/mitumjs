import { RegisterModelFact } from "./resgister-model"
import { CreateDataFact } from "./create-data"
import { UpdateDataFact } from "./update-data"
import { DeleteDataFact } from "./delete-data"
import { ContractGenerator, Operation } from "../base"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { IP, TimeStamp as TS, URIString, LongString } from "../../types"
import { Assert, MitumError, ECODE } from "../../error"

export class Storage extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }
    
    /**
     * Generate a `register-model` operation to register new storage model on the contract.
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
     * Generate `create-data` operation to create data with new data key on the storage model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [dataKey] - The key of data to create.
     * @param {string | LongString} [dataValue] - Value of the data to record.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-data` operation
     */
    createData(
        contract: string | Address,
        sender: string | Address,
        dataKey: string,
        dataValue: string | LongString,
        currency: string | CurrencyID,
    ) {
        new URIString(dataKey, 'dataKey');
        const fact = new CreateDataFact(
            TS.new().UTC(),
            sender,
            contract,
            dataKey,
            dataValue,
            currency,
        )

        return new Operation(this.networkID, fact)
    }

    /**
     * Generate `update-data` operation to update data with exist data key on the storage model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [dataKey] - The key of data to update.
     * @param {string | LongString} [dataValue] - Value of the data to be updated.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-data` operation
     */
    updateData(
        contract: string | Address,
        sender: string | Address,
        dataKey: string,
        dataValue: string | LongString,
        currency: string | CurrencyID,
    ) {
        new URIString(dataKey, 'dataKey');
        const fact = new UpdateDataFact(
            TS.new().UTC(),
            sender,
            contract,
            dataKey,
            dataValue,
            currency,
        )

        return new Operation(this.networkID, fact)
    }

    /**
     * Generate `delete-data` operation to delete data on the storage model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [dataKey] - The key of data to delete.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `delete-data` operation
     */
    deleteData(
        contract: string | Address,
        sender: string | Address,
        dataKey: string,
        currency: string | CurrencyID,
    ) {
        new URIString(dataKey, 'dataKey');
        const fact = new DeleteDataFact(
            TS.new().UTC(),
            sender,
            contract,
            dataKey,
            currency,
        )

        return new Operation(this.networkID, fact)
    }
    
    /**
     * Get information about a storage model on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the storage service:
     * - `_hint`: Hint for storage design,
     * - `project`: Project's name
     */
    async getModelInfo(contract: string | Address) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.storage.getModel(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get detailed information about a specific data on the project.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [dataKey] - The key of the data to search.
     * @returns `data` of `SuccessResponse` is information about the data with certain dataKey on the project:
     * - `data`: Object containing below information
     * - - `dataKey`: The key associated with the data,
     * - - `dataValue`: The current value of the data ,
     * - - `deleted`: Indicates whether the data has been deleted
     * - `height`: The block number where the latest related operation is recorded,
     * - `operation`: The fact hash of the latest related operation,
     * - `timestamp`: The timestamp of the latest related operation (prposed_at of block manifest)
     */
    async getData(
        contract: string | Address,
        dataKey: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(dataKey, 'dataKey');
        return await getAPIData(() => contractApi.storage.getData(this.api, contract, dataKey, this.delegateIP))
    }

    /**
     * Get all history information about a specific data on the project.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [dataKey] - The key of the data to search.
     * @param {number} [limit] - (Optional) The maximum number of history to retrieve.
     * @param {number} [offset] - (Optional) The Offset setting value based on block height
     * @param {boolean} [reverse] - (Optional) Whether to return the history in reverse newest order.
     * @returns `data` of `SuccessResponse` is an array of the history information about the data:
     * - `_hint`: Hint for currency,
     * - `_embedded`:
     * - - `data`: Object containing below information
     * - - - `dataKey`: The key associated with the data,
     * - - - `dataValue`: The current value of the data ,
     * - - - `deleted`: Indicates whether the data has been deleted
     * - - `height`: The block number where the latest related operation is recorded,
     * - - `operation`: The fact hash of the latest related operation,
     * - - `timestamp`: The timestamp of the latest related operation (prposed_at of block manifest),
     * - `_links`: Links for additional information
     */
    async getDataHistory(
        contract: string | Address,
        dataKey: string,
        limit?: number, offset?: number, reverse?: true
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(dataKey, 'dataKey');
        return await getAPIData(() => contractApi.storage.getDataHistory(
            this.api,
            contract,
            dataKey,
            this.delegateIP,
            limit,
            offset,
            reverse
        ))
    }
}