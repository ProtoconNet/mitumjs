import { CreateServiceFact } from "./create-service"
import { AppendFact } from "./append"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contract, getAPIData } from "../../api"
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
     * Generate a `create-service` operation for creating new timestamp service on the contract.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-service` operation.
     */
    createService(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new CreateServiceFact(
                TS.new().UTC(),
                sender,
                contractAddr,
                currency,
            )
        )
    }
    
    /**
     * Generate `append` operation for appending new timestamp to the project on the timestamp service.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [projectID] - The ID of the project to which data is appended.
     * @param {string | number | Big} [requestTimeStamp] - Value of the timestamp to record.
     * @param {string} [data] - The data to be appended.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `append` operation
     */
    append(
        contractAddr: string | Address,
        sender: string | Address,
        projectID: string,
        requestTimeStamp: string | number | Big,
        data: string,
        currency: string | CurrencyID,
    ) {
        new URIString(projectID, 'projectID');
        const fact = new AppendFact(
            TS.new().UTC(),
            sender,
            contractAddr,
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
     * @param {string | Address} [contractAddr] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the timestamp service:
     * - `_hint`: Hint for timestamp design,
     * - `projects`: Array of all project's id
     */
    async getServiceInfo(contractAddr: string | Address) {
        Address.from(contractAddr);
        return await getAPIData(() => contract.timestamp.getService(this.api, contractAddr, this.delegateIP))
    }
    
    /**
     * Get detailed information about a timestamp on the project.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
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
        contractAddr: string | Address,
        projectID: string,
        tid: string | number | Big,
    ) {
        Address.from(contractAddr);
        new URIString(projectID, 'projectID');
        return await getAPIData(() => contract.timestamp.getTimeStamp(this.api, contractAddr, projectID, tid, this.delegateIP))
    }
}