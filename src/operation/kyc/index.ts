import { CreateServiceFact } from "./create-service"
import { AddControllerItem, AddControllerFact } from "./add-controller"
import { RemoveControllerItem, RemoveControllerFact } from "./remove-controller"
import { AddCustomerItem, AddCustomerFact } from "./add-customer"
import { UpdateCustomerItem, UpdateCustomerFact } from "./update-customer"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Bool, IP, TimeStamp } from "../../types"

export class KYC extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    createService(
        contract: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new CreateServiceFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                currency,
            )
        )
    }

    addController(
        contract: string | Address,
        sender: string | Address,
        controller: string | Address,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new AddControllerFact(
                TimeStamp.new().UTC(),
                sender, [
                new AddControllerItem(
                    contract,
                    controller,
                    currency,
                )
            ]
            ),
        )
    }

    addCustomer(
        contract: string | Address,
        sender: string | Address,
        customer: string | Address,
        status: boolean | Bool,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new AddCustomerFact(
                TimeStamp.new().UTC(),
                sender, [
                new AddCustomerItem(
                    contract,
                    customer,
                    status,
                    currency,
                )
            ]
            )
        )
    }

    removeController(
        contract: string | Address,
        sender: string | Address,
        controller: string | Address,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RemoveControllerFact(
                TimeStamp.new().UTC(),
                sender, [
                new RemoveControllerItem(
                    contract,
                    controller,
                    currency,
                )
            ]
            )
        )
    }

    updateCustomer(
        contract: string | Address,
        sender: string | Address,
        customer: string | Address,
        status: boolean | Bool,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new UpdateCustomerFact(
                TimeStamp.new().UTC(), sender, [new UpdateCustomerItem(
                    contract,
                    customer,
                    status,
                    currency,
                )]),
        )
    }
}