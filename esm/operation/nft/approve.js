import { NFTItem } from "./item";
import { OperationFact } from "../base";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { Big } from "../../types";
import { Assert, ECODE, MitumError } from "../../error";
export class ApproveItem extends NFTItem {
    approved;
    nftIDX;
    constructor(contract, approved, nftIDX, currency) {
        super(HINT.NFT.APPROVE.ITEM, contract, currency);
        this.approved = Address.from(approved);
        this.nftIDX = Big.from(nftIDX);
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
        return {
            ...super.toHintedObject(),
            approved: this.approved.toString(),
            nftidx: this.nftIDX.v,
        };
    }
    toString() {
        return `${super.toString()}-${this.approved.toString()}`;
    }
}
export class ApproveFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.NFT.APPROVE.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate approve found in items"));
        this.items.forEach(it => Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return HINT.NFT.APPROVE.OPERATION;
    }
}
//# sourceMappingURL=approve.js.map