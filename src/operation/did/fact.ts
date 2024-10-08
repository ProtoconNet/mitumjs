import { ContractFact, FactJson } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { LongString } from "../../types"
import { Assert, StringAssert, ECODE, MitumError } from "../../error"

export abstract class DidFact extends ContractFact {
    readonly did: LongString
    protected constructor(
        hint: string,
        token: string,
        sender: string | Address,
        contract: string | Address,
        did: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(hint, token, sender, contract, currency)
        this.did = LongString.from(did)

        StringAssert.with(did.toString(), MitumError.detail(ECODE.DID.INVALID_DID, `The did must be starting with 'did:'`))
            .startsWith('did:')
            .excute()

        const splited = did.toString().split(":");
        Assert.check(splited.length === 3, MitumError.detail(ECODE.DID.INVALID_DID, "The did format must follow the standard."))
        Assert.check(/^[0-9a-f]+$/.test(splited[2]),MitumError.detail(ECODE.INVALID_ADDRESS, `${splited[2]} is not a hexadecimal number`),)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.did.toBuffer()
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            did:  this.did.toString(),
        }
    }
}