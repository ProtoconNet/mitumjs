import { ContractFact, FactJson } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"
import { URIString } from "../../types"

export abstract class DAOFact extends ContractFact {
    readonly proposalID: string

    protected constructor(
        hint: string,
        token: string,
        sender: string | Address,
        contract: string | Address,
        proposalID: string, 
        currency: string | CurrencyID,
    ) {
        super(hint, token, sender, contract, currency)
        
        new URIString(proposalID, 'proposalID');
        this.proposalID = proposalID

        Assert.check(
            this.proposalID !== "",
            MitumError.detail(ECODE.INVALID_FACT, "empty proposal id"),
        )

        // this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.proposalID),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            proposal_id: this.proposalID,
        }
    }
}