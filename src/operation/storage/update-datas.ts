import { HINT } from "../../alias"
import { Config } from "../../node"
import { Address } from "../../key"
import { HintedObject, LongString, URIString } from "../../types"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"
import { Item, OperationFact } from "../base"

export class UpdateDatasItem extends Item {
    readonly contract: Address
    readonly currency: CurrencyID
    readonly dataKey: LongString
    readonly dataValue: LongString

    constructor(contract: string | Address, currency: string | CurrencyID, dataKey: string | LongString, dataValue: string | LongString) {
        super(HINT.STORAGE.UPDATE_DATAS.ITEM)

        this.contract = Address.from(contract)
        this.currency = CurrencyID.from(currency)
        this.dataKey = LongString.from(dataKey)
        this.dataValue = LongString.from(dataValue)

        Assert.check(
            Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length),
            MitumError.detail(ECODE.INVALID_ITEM, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`),
        )
        Assert.check(
            Config.STORAGE.DATA_VALUE.satisfy(dataValue.toString().length),
            MitumError.detail(ECODE.INVALID_ITEM, `dataValue out of range, should be between ${Config.STORAGE.DATA_VALUE.min} to ${Config.STORAGE.DATA_VALUE.max}`),
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.dataKey.toBuffer(),
            this.dataValue.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            dataKey: this.dataKey.toString(),
            dataValue: this.dataValue.toString(),
            currency: this.currency.toString(),
        }
    }

    toString(): string {
        return this.dataKey.toString() + this.contract.toString()
    }
}

export class UpdateDatasFact extends OperationFact<UpdateDatasItem> {
    constructor(token: string, sender: string | Address, items: UpdateDatasItem[]) {
        super(HINT.STORAGE.UPDATE_DATAS.FACT, token, sender, items)

        this.items.forEach(
            it => {
                new URIString(it.dataKey.toString(), 'dataKey');
                Assert.check(
                    this.sender.toString() != it.contract.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"),
                )
            }
        )
    }

    get operationHint() {
        return HINT.STORAGE.UPDATE_DATAS.OPERATION
    }
}