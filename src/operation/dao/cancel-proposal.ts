import { DAOFact } from "./fact"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"

export class CancelProposalFact extends DAOFact {
    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        super(HINT.DAO.CANCEL_PROPOSAL.FACT, token, sender, contract, proposalID, currency)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    get operationHint() {
        return HINT.DAO.CANCEL_PROPOSAL.OPERATION
    }
}