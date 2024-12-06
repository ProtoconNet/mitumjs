import { Fact, FactJson } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { SortFunc, hasOverlappingAddress } from "../../utils"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"
import { Config } from "../../node"

export class UpdateRecipientFact extends Fact {
    readonly sender: Address
    readonly contract: Address
    readonly recipients: Address[]
    readonly currency: CurrencyID

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
        recipients: (string | Address)[],
    ) {
        super(HINT.CURRENCY.UPDATE_RECIPIENT.FACT, token)
        this.sender = Address.from(sender)
        this.contract = Address.from(contract)
        this.currency = CurrencyID.from(currency)
        this.recipients = recipients.map(a => Address.from(a))
        this._hash = this.hashing()
        
		Assert.check(Config.CONTRACT_RECIPIENTS.satisfy(recipients.length),
			MitumError.detail(ECODE.INVALID_LENGTH, "length of recipients array is out of range")
		);

        Assert.check(
            hasOverlappingAddress(this.recipients),
            MitumError.detail(ECODE.INVALID_FACT, "duplicate address found in recipients"),
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.recipients.sort(SortFunc).map(a => a.toBuffer())),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            contract: this.contract.toString(),
            currency: this.currency.toString(),
            recipients: this.recipients.sort(SortFunc).map((w) => w.toString()),
        }
    }

    get operationHint() {
        return HINT.CURRENCY.UPDATE_RECIPIENT.OPERATION
    }
}