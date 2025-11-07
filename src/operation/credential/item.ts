import { Item } from "../base"

import { Config } from "../../node"
import { Address } from "../../key/address"
import { CurrencyID } from "../../common"
import { HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export abstract class CredentialItem extends Item {
    readonly contract: Address
    readonly holder: Address
    readonly templateID: string
    readonly credentialID: string
    readonly currency: CurrencyID

    protected constructor(
        hint: string, 
        contract: string | Address, 
        holder: string | Address,
        templateID: string, 
        credentialID: string,
        currency: string | CurrencyID,
    ) {
        super(hint)

        this.contract = Address.from(contract)
        this.holder = Address.from(holder)
        this.templateID = templateID
        this.credentialID = credentialID
        this.currency = CurrencyID.from(currency)

        Assert.check(
            Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length),
            MitumError.detail(ECODE.INVALID_ITEM, "template id length out of range"),
        )

        Assert.check(
            Config.CREDENTIAL.ID.satisfy(credentialID.length),
            MitumError.detail(ECODE.INVALID_ITEM, "credential id length out of range"),
        )

        Assert.check(
            this.contract.toString() !== this.holder.toString(),
            MitumError.detail(ECODE.INVALID_ITEM, "holder is same with contract address")
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.holder.toBuffer(),
            Buffer.from(this.templateID),
            Buffer.from(this.credentialID),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            holder: this.holder.toString(),
            template_id: this.templateID,
            credential_id: this.credentialID,
            currency: this.currency.toString(),
        }
    }

    toString(): string {
        return this.contract.toString()
    }
}