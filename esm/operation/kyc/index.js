import { CreateServiceFact } from "./create-service";
import { AddControllerItem, AddControllerFact } from "./add-controller";
import { RemoveControllerItem, RemoveControllerFact } from "./remove-controller";
import { AddCustomerItem, AddCustomerFact } from "./add-customer";
import { UpdateCustomerItem, UpdateCustomerFact } from "./update-customer";
import { ContractGenerator, Operation } from "../base";
import { TimeStamp } from "../../types";
export class KYC extends ContractGenerator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createService(contractAddr, sender, currency) {
        return new Operation(this.networkID, new CreateServiceFact(TimeStamp.new().UTC(), sender, contractAddr, currency));
    }
    addController(contractAddr, sender, controller, currency) {
        return new Operation(this.networkID, new AddControllerFact(TimeStamp.new().UTC(), sender, [
            new AddControllerItem(contractAddr, controller, currency)
        ]));
    }
    addCustomer(contractAddr, sender, customer, status, currency) {
        return new Operation(this.networkID, new AddCustomerFact(TimeStamp.new().UTC(), sender, [
            new AddCustomerItem(contractAddr, customer, status, currency)
        ]));
    }
    removeController(contractAddr, sender, controller, currency) {
        return new Operation(this.networkID, new RemoveControllerFact(TimeStamp.new().UTC(), sender, [
            new RemoveControllerItem(contractAddr, controller, currency)
        ]));
    }
    updateCustomer(contractAddr, sender, customer, status, currency) {
        return new Operation(this.networkID, new UpdateCustomerFact(TimeStamp.new().UTC(), sender, [new UpdateCustomerItem(contractAddr, customer, status, currency)]));
    }
}
//# sourceMappingURL=index.js.map