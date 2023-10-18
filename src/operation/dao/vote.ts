import { DAOFact } from "./fact"
import { FactJson } from "../base"

import { Big } from "../../types"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"

export class VoteFact extends DAOFact {
    readonly vote: Big

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        proposalID: string,
        vote: string | number | Big,
        currency: string | CurrencyID,
    ) {
        super(HINT.DAO.VOTE.FACT, token, sender, contract, proposalID, currency)
        this.vote = Big.from(vote)
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.vote.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            vote: this.vote.v,
        }
    }

    get operationHint() {
        return HINT.DAO.VOTE.OPERATION
    }
}