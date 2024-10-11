import { Item } from "../base"

import { URIString, LongString } from "../../types"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { OperationFact } from "../base"
import { Config } from "../../node"
import { HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class MigrateDidItem extends Item {
    readonly contract: Address
    readonly currency: CurrencyID
    readonly publicKey: LongString
    readonly txId: LongString

    constructor(contract: Address | string, currency: CurrencyID | string, publicKey: string, txId: string) {
        super(HINT.DID.MIGRATE_DID.ITEM)

        this.contract = Address.from(contract)
        this.currency = CurrencyID.from(currency)
        this.publicKey = LongString.from(publicKey)
        this.txId = LongString.from(txId)
        new URIString(publicKey.toString(), 'merkleRoot');
        new URIString(txId.toString(), 'txId');

        Assert.check(/^[0-9a-fA-F]+$/.test(publicKey.toString().slice(-128)), MitumError.detail(ECODE.INVALID_FACT, `${this.publicKey.toString()} is not a hexadecimal number`))
        Assert.check(Config.DID.PUBLIC_KEY.satisfy(publicKey.toString().length),
            MitumError.detail(ECODE.INVALID_FACT, `publickey length out of range, should be over ${Config.DID.PUBLIC_KEY.min}`),
        )
    }
    
    toBuffer(): Buffer {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.publicKey.toBuffer(),
            this.txId.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            publicKey: this.publicKey.toString(),
            tx_hash: this.txId.toString(),
            currency: this.currency.toString()
        }
    }

    toString(): string {
        return this.publicKey.toString()
    }
}

export class MigrateDidFact extends OperationFact<MigrateDidItem> {
    constructor(token: string, sender: string | Address, items: MigrateDidItem[]) {
        super(HINT.DID.MIGRATE_DID.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicated item founded")
        )
    }

    get operationHint() {
        return HINT.DID.MIGRATE_DID.OPERATION
    }
}