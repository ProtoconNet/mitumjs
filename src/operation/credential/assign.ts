import { OperationFact } from "../base"
import { CredentialItem } from "./item"

import { HINT } from "../../alias"
import { Config } from "../../node"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"
import { Big, HintedObject } from "../../types"

export class AssignItem extends CredentialItem {
    readonly value: string
    readonly validFrom: Big
    readonly validUntil: Big
    readonly did: string

    constructor(
        contract: string | Address, 
        holder: string | Address, 
        templateID: string,
        id: string,
        value: string,
        validFrom: string | number | Big,
        validUntil: string | number | Big,
        did: string,
        currency: string | CurrencyID,
    ) {
        super(HINT.CREDENTIAL.ASSIGN.ITEM, contract, holder, templateID, id, currency)

        this.value = value
        this.validFrom = Big.from(validFrom)
        this.validUntil = Big.from(validUntil)
        this.did = did

        Assert.check(
            Config.CREDENTIAL.VALUE.satisfy(value.length),
            MitumError.detail(ECODE.INVALID_ITEM, "credential value length out of range"),    
        )

        Assert.check(
            validFrom < validUntil,
            MitumError.detail(ECODE.INVALID_ITEM, "valid until <= valid from")
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.value),
            this.validFrom.toBuffer("fill"),
            this.validUntil.toBuffer("fill"),
            Buffer.from(this.did),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            value: this.value,
            valid_from: this.validFrom.v,
            valid_until: this.validUntil.v,
            did: this.did,
        }
    }

    toString(): string {
        return `${super.toString()}-${this.id}`
    }
}

export class AssignFact extends OperationFact<AssignItem> {
    constructor(token: string, sender: string | Address, items: AssignItem[]) {
        super(HINT.CREDENTIAL.ASSIGN.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate credential id found in items")
        )

        items.forEach(
            item => {
                Assert.check(
                    item.contract.toString() !== sender.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")
                )
            }
        )
    }

    get operationHint() {
        return HINT.CREDENTIAL.ASSIGN.OPERATION
    }
}