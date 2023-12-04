import { CreateServiceFact } from "./create-service";
import { AppendFact } from "./append";
import { ContractGenerator, Operation } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { Big, IP } from "../../types";
export declare class TimeStamp extends ContractGenerator {
    constructor(networkID: string, api?: string | IP);
    createService(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID): Operation<CreateServiceFact>;
    append(contractAddr: string | Address, sender: string | Address, projectID: string, requestTimeStamp: string | number | Big, data: string, currency: string | CurrencyID): Operation<AppendFact>;
    getServiceInfo(contractAddr: string | Address): Promise<any>;
    getTimestampInfo(contractAddr: string | Address, projectID: string, tid: string | number | Big): Promise<any>;
}
