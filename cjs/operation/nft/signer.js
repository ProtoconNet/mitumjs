"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signers = exports.Signer = void 0;
const alias_1 = require("../../alias");
const common_1 = require("../../common");
const node_1 = require("../../node");
const key_1 = require("../../key");
const utils_1 = require("../../utils");
const error_1 = require("../../error");
const types_1 = require("../../types");
class Signer {
    constructor(account, share, signed) {
        this.hint = new common_1.Hint(alias_1.HINT.NFT.SIGNER);
        this.account = key_1.Address.from(account);
        this.share = types_1.Big.from(share);
        this.signed = types_1.Bool.from(signed);
        error_1.Assert.check(node_1.Config.NFT.SHARE.satisfy(this.share.v), error_1.MitumError.detail(error_1.ECODE.NFT.INVALID_NFT_SIGNER, "share out of range"));
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
exports.Signer = Signer;
class Signers {
    constructor(total, signers) {
        this.hint = new common_1.Hint(alias_1.HINT.NFT.SIGNERS);
        this.total = types_1.Big.from(total);
        this.signers = signers;
        error_1.Assert.check(node_1.Config.NFT.SIGNERS_IN_SIGNERS.satisfy(this.signers.length), error_1.MitumError.detail(error_1.ECODE.NFT.INVALID_NFT_SIGNERS, "signers length out of range"));
    }
    toBuffer() {
        return Buffer.concat([
            this.total.toBuffer("fill"),
            Buffer.concat(this.signers.sort(utils_1.SortFunc).map(s => s.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            total: this.total.v,
            signers: this.signers.sort(utils_1.SortFunc).map(s => s.toHintedObject()),
        };
    }
}
exports.Signers = Signers;
//# sourceMappingURL=signer.js.map