"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignFact = exports.SignItem = void 0;
const item_1 = require("./item");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const types_1 = require("../../types");
const error_1 = require("../../error");
class SignItem extends item_1.NFTItem {
    constructor(contract, nft, currency) {
        super(alias_1.HINT.NFT.SIGN.ITEM, contract, currency);
        this.nft = types_1.Big.from(nft);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.nft.toBuffer("fill"),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { nft: this.nft.v });
    }
}
exports.SignItem = SignItem;
class SignFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.NFT.SIGN.FACT, token, sender, items);
        this.items.forEach(it => error_1.Assert.check(this.sender.toString() != it.contract.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return alias_1.HINT.NFT.SIGN.OPERATION;
    }
}
exports.SignFact = SignFact;
//# sourceMappingURL=sign.js.map