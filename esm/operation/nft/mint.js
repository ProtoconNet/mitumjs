import { NFTItem } from "./item";
import { OperationFact } from "../base";
import { HINT } from "../../alias";
import { Address } from "../../key";
import { LongString } from "../../types";
import { Assert, ECODE, MitumError } from "../../error";
export class MintItem extends NFTItem {
    receiver;
    hash;
    uri;
    creators;
    constructor(contract, receiver, hash, uri, creators, currency) {
        super(HINT.NFT.MINT.ITEM, contract, currency);
        this.receiver = Address.from(receiver);
        this.hash = LongString.from(hash);
        this.uri = LongString.from(uri);
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
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            hash: this.hash.toString(),
            uri: this.uri.toString(),
            creators: this.creators.toHintedObject(),
        };
    }
}
export class MintFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.NFT.MINT.FACT, token, sender, items);
        this.items.forEach(it => Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return HINT.NFT.MINT.OPERATION;
    }
}
//# sourceMappingURL=mint.js.map