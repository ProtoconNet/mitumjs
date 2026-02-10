import { Buffer } from "buffer";
import { ContractFact, FactJson } from "../base"

import { Address } from "../../key/address"
import { CurrencyID } from "../../common"
import { URIString } from "../../types"

export abstract class DAOFact extends ContractFact {
    readonly proposalID: URIString

    protected constructor(
        hint: string,
        token: string,
        sender: string | Address,
        contract: string | Address,
        proposalID: string, 
        currency: string | CurrencyID,
    ) {
        super(hint, token, sender, contract, currency)
        this.proposalID = new URIString(proposalID, 'proposalID');
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.proposalID.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            proposal_id: this.proposalID.toString(),
        }
    }
}