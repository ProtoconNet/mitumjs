import { Generator, IP } from "../../types"

export abstract class ContractGenerator extends Generator {

    protected constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }
}