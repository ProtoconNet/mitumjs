import { NFTItem } from "./item"
import { OperationFact } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { Big, HintedObject } from "../../types"
import { ContractID, CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class ApproveItem extends NFTItem {
    readonly approved: Address
    readonly nftIDX: Big

    constructor(
        contract: string | Address, 
        collection: string | ContractID, 
        approved: string | Address, 
        nftIDX: number | Big, 
        currency: string | CurrencyID,
    ) {
        super(HINT.NFT.APPROVE.ITEM, contract, collection, currency)

        this.approved = Address.from(approved)
        this.nftIDX = Big.from(nftIDX)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.collection.toBuffer(),
            this.approved.toBuffer(),
            this.nftIDX.toBuffer("fill"),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            approved: this.approved.toString(),
            nftidx: this.nftIDX.v,
        }
    }

    toString(): string {
        return `${super.toString()}-${this.approved.toString()}`
    }
}

export class ApproveFact extends OperationFact<ApproveItem> {
    constructor(token: string, sender: string | Address, items: ApproveItem[]) {
        super(HINT.NFT.APPROVE.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate approve found in items")
        )
    }

    get operationHint() {
        return HINT.NFT.APPROVE.OPERATION
    }
}