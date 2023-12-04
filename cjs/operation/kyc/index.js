"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYC = void 0;
const create_service_1 = require("./create-service");
const add_controller_1 = require("./add-controller");
const remove_controller_1 = require("./remove-controller");
const add_customer_1 = require("./add-customer");
const update_customer_1 = require("./update-customer");
const base_1 = require("../base");
const types_1 = require("../../types");
class KYC extends base_1.ContractGenerator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createService(contractAddr, sender, currency) {
        return new base_1.Operation(this.networkID, new create_service_1.CreateServiceFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, currency));
    }
    addController(contractAddr, sender, controller, currency) {
        return new base_1.Operation(this.networkID, new add_controller_1.AddControllerFact(types_1.TimeStamp.new().UTC(), sender, [
            new add_controller_1.AddControllerItem(contractAddr, controller, currency)
        ]));
    }
    addCustomer(contractAddr, sender, customer, status, currency) {
        return new base_1.Operation(this.networkID, new add_customer_1.AddCustomerFact(types_1.TimeStamp.new().UTC(), sender, [
            new add_customer_1.AddCustomerItem(contractAddr, customer, status, currency)
        ]));
    }
    removeController(contractAddr, sender, controller, currency) {
        return new base_1.Operation(this.networkID, new remove_controller_1.RemoveControllerFact(types_1.TimeStamp.new().UTC(), sender, [
            new remove_controller_1.RemoveControllerItem(contractAddr, controller, currency)
        ]));
    }
    updateCustomer(contractAddr, sender, customer, status, currency) {
        return new base_1.Operation(this.networkID, new update_customer_1.UpdateCustomerFact(types_1.TimeStamp.new().UTC(), sender, [new update_customer_1.UpdateCustomerItem(contractAddr, customer, status, currency)]));
    }
}
exports.KYC = KYC;
//# sourceMappingURL=index.js.map