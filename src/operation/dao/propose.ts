import { DAOFact } from "./fact"
import { FactJson } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { BizProposal, CryptoProposal } from "./proposal"
import { Assert, ECODE, MitumError } from "../../error"

export class ProposeFact extends DAOFact {
    readonly proposal: CryptoProposal | BizProposal

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        proposalID: string,
        proposal: CryptoProposal | BizProposal,
        currency: string | CurrencyID,
    ) {
        super(HINT.DAO.PROPOSE.FACT, token, sender, contract, proposalID, currency)
        this.proposal = proposal
 
        Assert.check(proposal.proposer.toString() === sender, 
        MitumError.detail(ECODE.DAO.UNMATCHED_SENDER, `sender is unmatched with proposer of given proposal`))

        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.proposal.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            proposal: this.proposal.toHintedObject(),
        }
    }

    get operationHint() {
        return HINT.DAO.PROPOSE.OPERATION
    }
}