import { NFTItem } from "./item";
import { OperationFact } from "../base";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { Big } from "../../types";
import { Assert, ECODE, MitumError } from "../../error";
export class TransferItem extends NFTItem {
    receiver;
    nft;
    constructor(contract, receiver, nft, currency) {
        super(HINT.NFT.TRANSFER.ITEM, contract, currency);
        this.receiver = Address.from(receiver);
        this.nft = Big.from(nft);
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
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            nft: this.nft.v,
        };
    }
    toString() {
        return `${super.toString()}-${this.nft.toString()}`;
    }
}
export class TransferFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.NFT.TRANSFER.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate nft found in items"));
        this.items.forEach(it => Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return HINT.NFT.TRANSFER.OPERATION;
    }
}
//# sourceMappingURL=transfer.js.map