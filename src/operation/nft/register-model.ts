import { Buffer } from "buffer";
import { ContractFact, FactJson } from "../base"

import { HINT } from "../../alias"
import { Config } from "../../node"
import { Address } from "../../key/address"
import type { CurrencyID } from "../../common"
import { Big, LongString } from "../../types"
import { Assert, ECODE, MitumError, ArrayAssert } from "../../error"
import { SortFunc } from "../../utils"


export class RegisterModelFact extends ContractFact {
    readonly name: LongString
    readonly royalty: Big
    readonly uri: LongString
    readonly minterWhitelist: Address[] 

    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address, 
        name: string | LongString,
        royalty: string | number | Big,
        uri: string | LongString,
        minterWhitelist: (string | Address)[],
        currency: string | CurrencyID,
    ) {
        super(HINT.NFT.REGISTER_MODEL.FACT, token, sender, contract, currency)
        this.name = LongString.from(name)
        this.royalty = Big.from(royalty)
        this.uri = LongString.from(uri)
        this.minterWhitelist = minterWhitelist ? minterWhitelist.map(w => Address.from(w)) : []

        Assert.check(
            Config.NFT.ROYALTY.satisfy(this.royalty.v), 
            MitumError.detail(ECODE.INVALID_FACT, "royalty out of range"),
        )

        ArrayAssert.check(this.minterWhitelist, "whitelist")
            .rangeLength(Config.NFT.ADDRESS_IN_MINTER_WHITELIST)
            .noDuplicates();

        this.minterWhitelist.forEach(
            account => Assert.check(
                this.contract.toString() !== account.toString(),
                MitumError.detail(ECODE.INVALID_FACT, "contract is same with whitelist address")
            )
        )

        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.name.toBuffer(),
            this.royalty.toBuffer("fill"),
            this.uri.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.minterWhitelist.sort(SortFunc).map(w => w.toBuffer())),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            name: this.name.toString(),
            royalty: this.royalty.v,
            uri: this.uri.toString(),
            minter_whitelist: this.minterWhitelist.sort(SortFunc).map(w => w.toString()),
        }
    }

    get operationHint() {
        return HINT.NFT.REGISTER_MODEL.OPERATION
    }
}