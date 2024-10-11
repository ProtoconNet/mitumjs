import { Item } from "../base"

import { URIString, LongString } from "../../types"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { Config } from "../../node"
import { CurrencyID } from "../../common"
import { OperationFact } from "../base"
import { HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class MigrateDataItem extends Item {
    readonly contract: Address
    readonly currency: CurrencyID
    readonly merkleRoot: LongString
    readonly txHash: LongString

    constructor(contract: Address | string, currency: CurrencyID | string, merkleRoot: string, txHash: string) {
        super(HINT.DMILE.MIGRATE_DATA.ITEM)

        this.contract = Address.from(contract)
        this.currency = CurrencyID.from(currency)
        this.merkleRoot = LongString.from(merkleRoot)
        this.txHash = LongString.from(txHash)
        new URIString(merkleRoot.toString(), 'merkleRoot');
        new URIString(txHash.toString(), 'txHash');

        Assert.check(
            Config.DMILE.MERKLE_ROOT.satisfy(merkleRoot.toString().length),
            MitumError.detail(ECODE.INVALID_LENGTH, `merkleRoot length must be ${Config.DMILE.MERKLE_ROOT.min}`),
        )
    }
    
    toBuffer(): Buffer {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.merkleRoot.toBuffer(),
            this.txHash.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            merkle_root: this.merkleRoot.toString(),
            tx_hash: this.txHash.toString(),
            currency: this.currency.toString()
        }
    }

    toString(): string {
        return this.merkleRoot.toString()
    }
}

export class MigrateDataFact extends OperationFact<MigrateDataItem> {
    constructor(token: string, sender: string | Address, items: MigrateDataItem[]) {
        super(HINT.DMILE.MIGRATE_DATA.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicated item founded")
        )
    }

    get operationHint() {
        return HINT.DMILE.MIGRATE_DATA.OPERATION
    }
}