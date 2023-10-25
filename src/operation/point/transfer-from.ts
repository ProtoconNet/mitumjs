import { PointFact } from "./fact"
import { FactJson } from "../base"

import { Big } from "../../types"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class TransferFromFact extends PointFact {
    readonly receiver: Address
    readonly target: Address
    readonly amount: Big

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
        receiver: string | Address,
        target: string | Address,
        amount: string | number | Big,
    ) {
        super(HINT.POINT.TRANSFER_FROM.FACT, token, sender, contract, currency)

        this.receiver = Address.from(receiver)
        this.target = Address.from(target)
        this.amount = Big.from(amount)

        Assert.check(
            this.contract.toString() !== this.receiver.toString(),
            MitumError.detail(ECODE.INVALID_FACT, "contract is same with receiver address")
        )

        Assert.check(
            this.contract.toString() !== this.target.toString(),
            MitumError.detail(ECODE.INVALID_FACT, "contract is same with target address")
        )

        Assert.check(
            this.amount.compare(0) > 0,
            MitumError.detail(ECODE.INVALID_FACT, "zero amount"),
        )
        
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.target.toBuffer(),
            this.amount.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            receiver:  this.receiver.toString(),
            target: this.target.toString(),
            amount: this.amount.toString(),
        }
    }

    get operationHint() {
        return HINT.POINT.TRANSFER_FROM.OPERATION
    }
}