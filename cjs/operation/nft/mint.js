"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintFact = exports.MintItem = void 0;
const item_1 = require("./item");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const types_1 = require("../../types");
const error_1 = require("../../error");
class MintItem extends item_1.NFTItem {
    constructor(contract, receiver, hash, uri, creators, currency) {
        super(alias_1.HINT.NFT.MINT.ITEM, contract, currency);
        this.receiver = key_1.Address.from(receiver);
        this.hash = types_1.LongString.from(hash);
        this.uri = types_1.LongString.from(uri);
        this.creators = creators;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.hash.toBuffer(),
            this.uri.toBuffer(),
            this.creators.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), hash: this.hash.toString(), uri: this.uri.toString(), creators: this.creators.toHintedObject() });
    }
}
exports.MintItem = MintItem;
class MintFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.NFT.MINT.FACT, token, sender, items);
        this.items.forEach(it => error_1.Assert.check(this.sender.toString() != it.contract.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return alias_1.HINT.NFT.MINT.OPERATION;
    }
}
exports.MintFact = MintFact;
//# sourceMappingURL=mint.js.map