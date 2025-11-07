import { HINT } from "../../alias"
import { Address } from "../../key/address"
import { Hint, CurrencyID } from "../../common"
import { Big, Float, HintedObject, IBuffer, IHintedObject } from "../../types"

export class CurrencyDesign implements IBuffer, IHintedObject {
    private static hint: Hint = new Hint(HINT.CURRENCY.DESIGN)
    readonly initialSupply: Big
    readonly currencyID: CurrencyID
    readonly policy: CurrencyPolicy
    readonly genesisAccount: Address
    readonly totalSupply: Big
    readonly decimal: Big

    constructor(
        initialSupply: string | number | Big,
        currencyID: string | CurrencyID,
        genesisAccount: string | Address,
        decimal: string | number | Big,
        policy: CurrencyPolicy
    ) {
        this.initialSupply = Big.from(initialSupply)
        this.currencyID = CurrencyID.from(currencyID)
        this.genesisAccount = Address.from(genesisAccount)
        this.policy = policy
        this.totalSupply = Big.from(initialSupply)
        this.decimal = Big.from(decimal)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.initialSupply.toBuffer(), 
            this.currencyID.toBuffer(),
            this.decimal.toBuffer(),
            this.genesisAccount.toBuffer(),
            this.policy.toBuffer(),
            this.totalSupply.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            _hint: CurrencyDesign.hint.toString(),
            currency_id: this.currencyID.toString(),
            decimal: this.decimal.toString(),
            genesis_account: this.genesisAccount.toString(),
            initial_supply: this.initialSupply.toString(),
            policy: this.policy.toHintedObject(),
            total_supply: this.totalSupply.toString(),
        }
    }
}

export class CurrencyPolicy implements IBuffer, IHintedObject {
    private static hint: Hint = new Hint(HINT.CURRENCY.POLICY)
    readonly newAccountMinBalance: Big
    readonly feeer: Feeer

    constructor(newAccountMinBalance: string | number | Big, feeer: Feeer) {
        this.newAccountMinBalance = Big.from(newAccountMinBalance)
        this.feeer = feeer
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.newAccountMinBalance.toBuffer(),
            this.feeer.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            _hint: CurrencyPolicy.hint.toString(),
            feeer: this.feeer.toHintedObject(),
            min_balance: this.newAccountMinBalance.toString(),
        }
    }
}

abstract class Feeer implements IBuffer, IHintedObject {
    private hint: Hint
    readonly exchangeMinAmount?: Big

    constructor(hint: string, exchangeMinAmount?: string | number | Big) {
        this.hint = new Hint(hint)

        if (exchangeMinAmount) {
            this.exchangeMinAmount = exchangeMinAmount instanceof Big ? exchangeMinAmount : new Big(exchangeMinAmount)
        }
    }

    abstract toBuffer(): Buffer

    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString()
        }
    }
}

export class NilFeeer extends Feeer {
    constructor() {
        super(HINT.CURRENCY.FEEER.NIL)
    }

    toBuffer(): Buffer {
        return Buffer.from([])
    }
}

export class FixedFeeer extends Feeer {
    readonly receiver: Address
    readonly amount: Big

    constructor(receiver: string | Address, amount: string | number | Big) {
        super(HINT.CURRENCY.FEEER.FIXED)
        this.receiver = Address.from(receiver)
        this.amount = Big.from(amount)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.receiver.toBuffer(), 
            this.amount.toBuffer(), 
            this.exchangeMinAmount ? this.exchangeMinAmount.toBuffer() : Buffer.from([])
        ])
    }

    toHintedObject(): HintedObject {
        const feeer = {
            ...super.toHintedObject(),
            amount: this.amount.toString(),
            receiver: this.receiver.toString(),
        }

        if (this.exchangeMinAmount) {
            return {
                ...feeer,
                exchange_min_amount: this.exchangeMinAmount.toString()
            }
        }

        return feeer
    }
}

export class RatioFeeer extends Feeer {
    readonly receiver: Address
    readonly ratio: Float
    readonly min: Big
    readonly max: Big

    constructor(receiver: string | Address, ratio: number, min: string | number | Big, max: string | number | Big) {
        super(HINT.CURRENCY.FEEER.RATIO)
        this.receiver = Address.from(receiver)
        this.ratio = new Float(ratio)
        this.min = min instanceof Big ? min : new Big(min)
        this.max = max instanceof Big ? max : new Big(max)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.receiver.toBuffer(), 
            this.ratio.toBuffer(),
            this.min.toBuffer(),
            this.max.toBuffer(), 
            this.exchangeMinAmount ? this.exchangeMinAmount.toBuffer() : Buffer.from([])
        ])
    }

    toHintedObject(): HintedObject {
        const feeer = {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            ratio: this.ratio.n,
            min: this.min.toString(),
            max: this.max.toString(),
        }

        if (this.exchangeMinAmount) {
            return {
                ...feeer,
                exchange_min_amount: this.exchangeMinAmount.toString(),
            }
        }

        return feeer
    }
}

