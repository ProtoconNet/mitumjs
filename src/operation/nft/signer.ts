import { HINT } from "../../alias"
import { Hint } from "../../common"
import { Config } from "../../node"
import { Address } from "../../key"
import { SortFunc } from "../../utils"
import { Assert, ECODE, MitumError } from "../../error"
import { Big, Bool, HintedObject, IBuffer, IHintedObject } from "../../types"

export class Signer implements IBuffer, IHintedObject {
    readonly hint: Hint
    readonly account: Address
    readonly share: Big
    readonly signed: Bool

    constructor(account: string | Address, share: string | number | Big, signed: boolean | Bool) {
        this.hint = new Hint(HINT.NFT.SIGNER)
        
        this.account = Address.from(account)
        this.share = Big.from(share)
        this.signed = Bool.from(signed)

        Assert.check(
            Config.NFT.SHARE.satisfy(this.share.v),
            MitumError.detail(ECODE.NFT.INVALID_NFT_SIGNER, "share out of range"),
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.account.toBuffer(),
            this.share.toBuffer("fill"),
            this.signed.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString(),
            account: this.account.toString(),
            share: this.share.v,
            signed: this.signed.v,
        }
    }
}

export class Signers implements IBuffer, IHintedObject {
    readonly hint: Hint
    readonly signers: Signer[]

    constructor(signers: Signer[]) {
        this.hint = new Hint(HINT.NFT.SIGNERS)
        this.signers = signers

        const total = this.signers.reduce((prev, next) => prev + Big.from(next.share).v, 0);

        Assert.check(
            total <= 100,
            MitumError.detail(ECODE.NFT.INVALID_NFT_SIGNERS, `total share over max, ${total} > 100`),
        )

        Assert.check(
            Config.NFT.SIGNERS_IN_SIGNERS.satisfy(this.signers.length),
            MitumError.detail(ECODE.NFT.INVALID_NFT_SIGNERS, "signers length out of range"),
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            Buffer.concat(this.signers.sort(SortFunc).map(s => s.toBuffer())),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString(),
            signers: this.signers.sort(SortFunc).map(s => s.toHintedObject()),
        }
    }
}