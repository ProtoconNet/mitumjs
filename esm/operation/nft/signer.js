import { HINT } from "../../alias";
import { Hint } from "../../common";
import { Config } from "../../node";
import { Address } from "../../key";
import { SortFunc } from "../../utils";
import { Assert, ECODE, MitumError } from "../../error";
import { Big, Bool } from "../../types";
export class Signer {
    hint;
    account;
    share;
    signed;
    constructor(account, share, signed) {
        this.hint = new Hint(HINT.NFT.SIGNER);
        this.account = Address.from(account);
        this.share = Big.from(share);
        this.signed = Bool.from(signed);
        Assert.check(Config.NFT.SHARE.satisfy(this.share.v), MitumError.detail(ECODE.NFT.INVALID_NFT_SIGNER, "share out of range"));
    }
    toBuffer() {
        return Buffer.concat([
            this.account.toBuffer(),
            this.share.toBuffer("fill"),
            this.signed.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            account: this.account.toString(),
            share: this.share.v,
            signed: this.signed.v,
        };
    }
}
export class Signers {
    hint;
    total;
    signers;
    constructor(total, signers) {
        this.hint = new Hint(HINT.NFT.SIGNERS);
        this.total = Big.from(total);
        this.signers = signers;
        Assert.check(Config.NFT.SIGNERS_IN_SIGNERS.satisfy(this.signers.length), MitumError.detail(ECODE.NFT.INVALID_NFT_SIGNERS, "signers length out of range"));
    }
    toBuffer() {
        return Buffer.concat([
            this.total.toBuffer("fill"),
            Buffer.concat(this.signers.sort(SortFunc).map(s => s.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            total: this.total.v,
            signers: this.signers.sort(SortFunc).map(s => s.toHintedObject()),
        };
    }
}
//# sourceMappingURL=signer.js.map