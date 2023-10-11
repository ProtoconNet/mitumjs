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
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
            )
        )
    }

    addController(
        contractAddr: string | Address,
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
                    contractAddr,
                    controller,
                    currency,
                )
            ]
            ),
        )
    }

    addCustomer(
        contractAddr: string | Address,
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
                    contractAddr,
                    customer,
                    status,
                    currency,
                )
            ]
            )
        )
    }

    removeController(
        contractAddr: string | Address,
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
                    contractAddr,
                    controller,
                    currency,
                )
            ]
            )
        )
    }

    updateCustomer(
        contractAddr: string | Address,
        sender: string | Address,
        customer: string | Address,
        status: boolean | Bool,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new UpdateCustomerFact(
                TimeStamp.new().UTC(), sender, [new UpdateCustomerItem(
                    contractAddr,
                    customer,
                    status,
                    currency,
                )]),
        )
    }
}