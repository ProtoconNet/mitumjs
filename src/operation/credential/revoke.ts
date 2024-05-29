import { OperationFact } from "../base"
import { CredentialItem } from "./item"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class RevokeItem extends CredentialItem {
    constructor(
        contract: string | Address, 
        holder: string | Address, 
        templateID: string,
        id: string,
        currency: string | CurrencyID,
    ) {
        super(HINT.CREDENTIAL.REVOKE.ITEM, contract, holder, templateID, id, currency)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toString(): string {
        return `${super.toString()}-${this.id}`
    }
}

export class RevokeFact extends OperationFact<RevokeItem> {
    constructor(token: string, sender: string | Address, items: RevokeItem[]) {
        super(HINT.CREDENTIAL.REVOKE.FACT, token, sender, items)

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
        return HINT.CREDENTIAL.REVOKE.OPERATION
    }
}