import { NFTItem } from "./item"
import { OperationFact } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Big, HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class AddSignatureItem extends NFTItem {
    readonly nftIdx: Big

    constructor(
        contract: string | Address, 
        nftIdx: string | number | Big, 
        currency: string | CurrencyID,
    ) {
        super(HINT.NFT.ADD_SIGNATURE.ITEM, contract, currency)
        this.nftIdx = Big.from(nftIdx)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.nftIdx.toBuffer("fill"),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            nft_idx: this.nftIdx.v,
        }
    }
}

export class AddSignatureFact extends OperationFact<AddSignatureItem> {
    constructor(token: string, sender: string | Address, items: AddSignatureItem[]) {
        super(HINT.NFT.ADD_SIGNATURE.FACT, token, sender, items)

        this.items.forEach(
            it => Assert.check(
                this.sender.toString() != it.contract.toString(),
                MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"),
            )
        )
    }

    get operationHint() {
        return HINT.NFT.ADD_SIGNATURE.OPERATION
    }
}