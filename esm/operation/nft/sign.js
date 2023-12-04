import { NFTItem } from "./item";
import { OperationFact } from "../base";
import { HINT } from "../../alias";
import { Big } from "../../types";
import { Assert, ECODE, MitumError } from "../../error";
export class SignItem extends NFTItem {
    nft;
    constructor(contract, nft, currency) {
        super(HINT.NFT.SIGN.ITEM, contract, currency);
        this.nft = Big.from(nft);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.nft.toBuffer("fill"),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            nft: this.nft.v,
        };
    }
}
export class SignFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.NFT.SIGN.FACT, token, sender, items);
        this.items.forEach(it => Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return HINT.NFT.SIGN.OPERATION;
    }
}
//# sourceMappingURL=sign.js.map