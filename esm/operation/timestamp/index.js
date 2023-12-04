import { CreateServiceFact } from "./create-service";
import { AppendFact } from "./append";
import { ContractGenerator, Operation } from "../base";
import { contract, getAPIData } from "../../api";
import { TimeStamp as TS } from "../../types";
export class TimeStamp extends ContractGenerator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createService(contractAddr, sender, currency) {
        return new Operation(this.networkID, new CreateServiceFact(TS.new().UTC(), sender, contractAddr, currency));
    }
    append(contractAddr, sender, projectID, requestTimeStamp, data, currency) {
        const fact = new AppendFact(TS.new().UTC(), sender, contractAddr, projectID, requestTimeStamp, data, currency);
        return new Operation(this.networkID, fact);
    }
    async getServiceInfo(contractAddr) {
        return await getAPIData(() => contract.timestamp.getService(this.api, contractAddr));
    }
    async getTimestampInfo(contractAddr, projectID, tid) {
        return await getAPIData(() => contract.timestamp.getTimeStamp(this.api, contractAddr, projectID, tid));
    }
}
//# sourceMappingURL=index.js.map