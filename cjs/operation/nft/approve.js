"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveFact = exports.ApproveItem = void 0;
const item_1 = require("./item");
const base_1 = require("../base");
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const types_1 = require("../../types");
const error_1 = require("../../error");
class ApproveItem extends item_1.NFTItem {
    constructor(contract, approved, nftIDX, currency) {
        super(alias_1.HINT.NFT.APPROVE.ITEM, contract, currency);
        this.approved = key_1.Address.from(approved);
        this.nftIDX = types_1.Big.from(nftIDX);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            this.nftIDX.toBuffer("fill"),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { approved: this.approved.toString(), nftidx: this.nftIDX.v });
    }
    toString() {
        return `${super.toString()}-${this.approved.toString()}`;
    }
}
exports.ApproveItem = ApproveItem;
class ApproveFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.NFT.APPROVE.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate approve found in items"));
        this.items.forEach(it => error_1.Assert.check(this.sender.toString() != it.contract.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return alias_1.HINT.NFT.APPROVE.OPERATION;
    }
}
exports.ApproveFact = ApproveFact;
//# sourceMappingURL=approve.js.map