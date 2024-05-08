import base58 from "bs58"

import { CurrencyItem } from "./item"
import { OperationFact } from "../base"

import { Amount } from "../../common"
import { SortFunc } from "../../utils"
import { HINT } from "../../alias"
import { HintedObject } from "../../types"
import { Keys, Address, EtherKeys } from "../../key"
import { Assert, ECODE, MitumError } from "../../error"

export class CreateContractAccountItem extends CurrencyItem {
    readonly keys: Keys | EtherKeys
    
    constructor(keys: Keys | EtherKeys, amounts: Amount[]) {
        super(HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.ITEM, amounts)
        this.keys = keys
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.keys.toBuffer(),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            keys: this.keys.toHintedObject(),
        }
    }

    toString(): string {
        return base58.encode(this.keys.toBuffer())
    }
}

export class CreateContractAccountFact extends OperationFact<CreateContractAccountItem> {
    constructor(token: string, sender: string | Address, items: CreateContractAccountItem[]) {
        super(HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate key hash found in items")
        )
    }

    get operationHint() {
        return HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.OPERATION
    }
}