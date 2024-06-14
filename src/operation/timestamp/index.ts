import { RegisterModelFact } from "./resgister-model"
import { IssueFact } from "./issue"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { Big, IP, TimeStamp as TS, URIString } from "../../types"

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
     * @returns `register-model`` operation.
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
    async getServiceInfo(contract: string | Address) {
        Address.from(contract);
        return await getAPIData(() => contractApi.timestamp.getService(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get detailed information about a timestamp on the project.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [projectID] - The ID of the project.
     * @param {string | number | Big} [tid] - The timestamp ID (Indicate the order of appended to the project)
     * @returns `data` of `SuccessResponse` is information about the timestamp with certain tid on the certain project:
     * - `_hint`: Hint for timestamp item,
     * - `projectid`: ID of the timestamp project,
     * - `request_timestamp`: Request timestamp entered when appending timestamp,
     * - `response_timestamp`: Time when the timestamp was registered,
     * - `timestampid`: A number representing the timestamp id,
     * - `data`: Data string
     */
    async getTimestampInfo(
        contract: string | Address,
        projectID: string,
        tid: string | number | Big,
    ) {
        Address.from(contract);
        new URIString(projectID, 'projectID');
        return await getAPIData(() => contractApi.timestamp.getTimeStamp(this.api, contract, projectID, tid, this.delegateIP))
    }
}