"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCollectionPolicyFact = void 0;
const base_1 = require("../base");
const alias_1 = require("../../alias");
const node_1 = require("../../node");
const key_1 = require("../../key");
const utils_1 = require("../../utils");
const types_1 = require("../../types");
const error_1 = require("../../error");
class UpdateCollectionPolicyFact extends base_1.ContractFact {
    constructor(token, sender, contract, name, royalty, uri, whitelist, currency) {
        super(alias_1.HINT.NFT.UPDATE_COLLECTION_POLICY.FACT, token, sender, contract, currency);
        this.name = types_1.LongString.from(name);
        this.royalty = types_1.Big.from(royalty);
        this.uri = types_1.LongString.from(uri);
        this.whitelist = whitelist ? whitelist.map(w => key_1.Address.from(w)) : [];
        error_1.Assert.check(node_1.Config.NFT.ROYALTY.satisfy(this.royalty.v), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "royalty out of range"));
        error_1.Assert.check(node_1.Config.NFT.ADDRESS_IN_WHITELIST.satisfy(this.whitelist.length), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "whitelist length out of range"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.name.toBuffer(),
            this.royalty.toBuffer("fill"),
            this.uri.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.whitelist.sort(utils_1.SortFunc).map(w => w.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { name: this.name.toString(), royalty: this.royalty.v, uri: this.uri.toString(), whitelist: this.whitelist.sort(utils_1.SortFunc).map(w => w.toString()) });
    }
    get operationHint() {
        return alias_1.HINT.NFT.UPDATE_COLLECTION_POLICY.OPERATION;
    }
}
exports.UpdateCollectionPolicyFact = UpdateCollectionPolicyFact;
//# sourceMappingURL=update-collection-policy.js.map