import { Fact, FactJson } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { SortFunc, hasOverlappingAddress } from "../../utils"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class UpdateOperatorFact extends Fact {
    readonly sender: Address
    readonly contract: Address
    readonly operators: Address[]
    readonly currency: CurrencyID

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
        operators: (string | Address)[],
    ) {
        super(HINT.CURRENCY.UPDATE_OPERATOR.FACT, token)
        this.sender = Address.from(sender)
        this.contract = Address.from(contract)
        this.currency = CurrencyID.from(currency)
        this.operators = operators.map(a => Address.from(a))
        this._hash = this.hashing()
        
        Assert.check(
            (this.operators.length !== 0),
            MitumError.detail(ECODE.INVALID_FACT, "empty operators"),
        )
        Assert.check(
            hasOverlappingAddress(this.operators),
            MitumError.detail(ECODE.INVALID_FACT, "duplicate address found in operators"),
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.operators.sort(SortFunc).map(a => a.toBuffer())),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            contract: this.contract.toString(),
            currency: this.currency.toString(),
            operators: this.operators.sort(SortFunc).map((w) => w.toString()),
        }
    }

    get operationHint() {
        return HINT.CURRENCY.UPDATE_OPERATOR.OPERATION
    }
}