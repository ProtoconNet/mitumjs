import { CreateServiceFact } from "./create-service";
import { AddControllerFact } from "./add-controller";
import { RemoveControllerFact } from "./remove-controller";
import { AddCustomerFact } from "./add-customer";
import { UpdateCustomerFact } from "./update-customer";
import { ContractGenerator, Operation } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { Bool, IP } from "../../types";
export declare class KYC extends ContractGenerator {
    constructor(networkID: string, api?: string | IP);
    createService(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID): Operation<CreateServiceFact>;
    addController(contractAddr: string | Address, sender: string | Address, controller: string | Address, currency: string | CurrencyID): Operation<AddControllerFact>;
    addCustomer(contractAddr: string | Address, sender: string | Address, customer: string | Address, status: boolean | Bool, currency: string | CurrencyID): Operation<AddCustomerFact>;
    removeController(contractAddr: string | Address, sender: string | Address, controller: string | Address, currency: string | CurrencyID): Operation<RemoveControllerFact>;
    updateCustomer(contractAddr: string | Address, sender: string | Address, customer: string | Address, status: boolean | Bool, currency: string | CurrencyID): Operation<UpdateCustomerFact>;
}
