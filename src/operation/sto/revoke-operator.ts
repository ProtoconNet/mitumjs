import { STOItem } from "./item"
import { Partition } from "./partition"
import { OperationFact } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class RevokeOperatorItem extends STOItem {
    readonly operator: Address
    readonly partition: Partition

    constructor(
        contract: string | Address, 
        operator: string | Address,
        partition: string | Partition,
        currency: string | CurrencyID,
    ) {
        super(HINT.STO.REVOKE_OPERATOR.ITEM, contract, currency)

        this.operator = Address.from(operator)
        this.partition = Partition.from(partition)

        Assert.check(
            this.contract.toString() !== this.operator.toString(),
            MitumError.detail(ECODE.INVALID_ITEM, "contract is same with operator address")
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.operator.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            operator: this.operator.toString(),
            partition: this.partition.toString(),
        }
    }

    toString(): string {
        return this.operator.toString()
    }
}

export class RevokeOperatorFact extends OperationFact<RevokeOperatorItem> {
    constructor(token: string, sender: string | Address, items: RevokeOperatorItem[]) {
        super(HINT.STO.REVOKE_OPERATOR.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate operator found in items")
        )
    }

    get operationHint() {
        return HINT.STO.REVOKE_OPERATOR.OPERATION
    }
}