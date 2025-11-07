import { Fact, FactJson } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key/address"
import { SortFunc } from "../../utils"
import { CurrencyID } from "../../common"
import { ArrayAssert } from "../../error"
import { Config } from "../../node"

export class UpdateHandlerFact extends Fact {
    readonly sender: Address
    readonly contract: Address
    readonly handlers: Address[]
    readonly currency: CurrencyID

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
        handlers: (string | Address)[],
    ) {
        super(HINT.CURRENCY.UPDATE_HANDLER.FACT, token)
        this.sender = Address.from(sender)
        this.contract = Address.from(contract)
        this.currency = CurrencyID.from(currency)
        this.handlers = handlers.map(a => Address.from(a))
        this._hash = this.hashing()
        
        ArrayAssert.check(handlers, "handlers")
            .rangeLength(Config.CONTRACT_HANDLERS)
            .noDuplicates();
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.handlers.sort(SortFunc).map(a => a.toBuffer())),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            contract: this.contract.toString(),
            currency: this.currency.toString(),
            handlers: this.handlers.sort(SortFunc).map((w) => w.toString()),
        }
    }

    get operationHint() {
        return HINT.CURRENCY.UPDATE_HANDLER.OPERATION
    }
}