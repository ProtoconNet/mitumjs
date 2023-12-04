"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferFact = exports.TransferItem = void 0;
const item_1 = require("./item");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const types_1 = require("../../types");
const error_1 = require("../../error");
class TransferItem extends item_1.NFTItem {
    constructor(contract, receiver, nft, currency) {
        super(alias_1.HINT.NFT.TRANSFER.ITEM, contract, currency);
        this.receiver = key_1.Address.from(receiver);
        this.nft = types_1.Big.from(nft);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.nft.toBuffer("fill"),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), nft: this.nft.v });
    }
    toString() {
        return `${super.toString()}-${this.nft.toString()}`;
    }
}
exports.TransferItem = TransferItem;
class TransferFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.NFT.TRANSFER.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate nft found in items"));
        this.items.forEach(it => error_1.Assert.check(this.sender.toString() != it.contract.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return alias_1.HINT.NFT.TRANSFER.OPERATION;
    }
}
exports.TransferFact = TransferFact;
//# sourceMappingURL=transfer.js.map