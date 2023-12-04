import { ContractFact } from "../base";
import { HINT } from "../../alias";
import { Config } from "../../node";
import { Address } from "../../key";
import { SortFunc } from "../../utils";
import { Big, LongString } from "../../types";
import { Assert, ECODE, MitumError } from "../../error";
export class UpdateCollectionPolicyFact extends ContractFact {
    name;
    royalty;
    uri;
    whitelist;
    constructor(token, sender, contract, name, royalty, uri, whitelist, currency) {
        super(HINT.NFT.UPDATE_COLLECTION_POLICY.FACT, token, sender, contract, currency);
        this.name = LongString.from(name);
        this.royalty = Big.from(royalty);
        this.uri = LongString.from(uri);
        this.whitelist = whitelist ? whitelist.map(w => Address.from(w)) : [];
        Assert.check(Config.NFT.ROYALTY.satisfy(this.royalty.v), MitumError.detail(ECODE.INVALID_FACT, "royalty out of range"));
        Assert.check(Config.NFT.ADDRESS_IN_WHITELIST.satisfy(this.whitelist.length), MitumError.detail(ECODE.INVALID_FACT, "whitelist length out of range"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.name.toBuffer(),
            this.royalty.toBuffer("fill"),
            this.uri.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.whitelist.sort(SortFunc).map(w => w.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            name: this.name.toString(),
            royalty: this.royalty.v,
            uri: this.uri.toString(),
            whitelist: this.whitelist.sort(SortFunc).map(w => w.toString()),
        };
    }
    get operationHint() {
        return HINT.NFT.UPDATE_COLLECTION_POLICY.OPERATION;
    }
}
//# sourceMappingURL=update-collection-policy.js.map