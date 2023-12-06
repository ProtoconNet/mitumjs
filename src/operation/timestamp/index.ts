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
    ) {
        super(networkID, api)
    }

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

    async getServiceInfo(contractAddr: string | Address) {
        return await getAPIData(() => contract.timestamp.getService(this.api, contractAddr))
    }

    async getTimestampInfo(
        contractAddr: string | Address,
        projectID: string,
        tid: string | number | Big,
    ) {
        return await getAPIData(() => contract.timestamp.getTimeStamp(this.api, contractAddr, projectID, tid))
    }
}