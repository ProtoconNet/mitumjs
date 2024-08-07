import { RegisterModelFact } from "./resgister-model"
import { IssueFact } from "./issue"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { Big, IP, TimeStamp as TS, URIString } from "../../types"
import { Assert, MitumError, ECODE } from "../../error"

export class TimeStamp extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }
    
    /**
     * Generate a `register-model` operation to register new timestamp model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(
        contract: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RegisterModelFact(
                TS.new().UTC(),
                sender,
                contract,
                currency,
            )
        )
    }
    
    /**
     * Generate `issue` operation to issue new timestamp to the project on the timestamp model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [projectID] - The ID of the project to issue.
     * @param {string | number | Big} [requestTimeStamp] - Value of the timestamp to record.
     * @param {string} [data] - The data to be appended.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `issue` operation
     */
    issue(
        contract: string | Address,
        sender: string | Address,
        projectID: string,
        requestTimeStamp: string | number | Big,
        data: string,
        currency: string | CurrencyID,
    ) {
        new URIString(projectID, 'projectID');
        const fact = new IssueFact(
            TS.new().UTC(),
            sender,
            contract,
            projectID,
            requestTimeStamp,
            data,
            currency,
        )

        return new Operation(this.networkID, fact)
    }
    
    /**
     * Get information about a timestamp service on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the timestamp service:
     * - `_hint`: Hint for timestamp design,
     * - `projects`: Array of all project's id
     */
    async getModelInfo(contract: string | Address) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.timestamp.getModel(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get detailed information about a timestamp on the project.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [projectID] - The ID of the project.
     * @param {string | number | Big} [timestampIdx] - The index of timestamp (Indicate the order of appended to the project)
     * @returns `data` of `SuccessResponse` is information about the timestamp with certain tid on the certain project:
     * - `_hint`: Hint for timestamp item,
     * - `project_id`: ID of the timestamp project,
     * - `request_timestamp`: Request timestamp entered when appending timestamp,
     * - `response_timestamp`: Time when the timestamp was registered,
     * - `timestamp_idx`: A index for the timestamp ,
     * - `data`: Data string
     */
    async getTimestamp(
        contract: string | Address,
        projectID: string,
        timestampIdx: string | number | Big,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(projectID, 'projectID');
        return await getAPIData(() => contractApi.timestamp.getTimeStamp(this.api, contract, projectID, timestampIdx, this.delegateIP))
    }
}