// import { Address } from "../../key"
import { Generator, IP } from "../../types"

export abstract class ContractGenerator extends Generator {

    protected constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }
}