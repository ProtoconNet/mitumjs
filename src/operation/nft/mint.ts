import { NFTItem } from "./item"
import { Signers } from "./signer"
import { OperationFact } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { HintedObject, LongString } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class MintItem extends NFTItem {
    readonly hash: LongString
    readonly uri: LongString
    readonly creators: Signers

    constructor(
        contract: string | Address, 
        hash: string | LongString, 
        uri: string | LongString,
        creators: Signers,
        currency: string | CurrencyID,
    ) {
        super(HINT.NFT.MINT.ITEM, contract, currency)

        this.hash = LongString.from(hash)
        this.uri = LongString.from(uri)
        this.creators = creators
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.hash.toBuffer(),
            this.uri.toBuffer(),
            this.creators.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            hash: this.hash.toString(),
            uri: this.uri.toString(),
            creators: this.creators.toHintedObject(),
        }
    }
}

export class MintFact extends OperationFact<MintItem> {
    constructor(token: string, sender: string | Address, items: MintItem[]) {
        super(HINT.NFT.MINT.FACT, token, sender, items)

        this.items.forEach(
            it => Assert.check(
                this.sender.toString() != it.contract.toString(),
                MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"),
            )
        )
    }

    get operationHint() {
        return HINT.NFT.MINT.OPERATION
    }
}