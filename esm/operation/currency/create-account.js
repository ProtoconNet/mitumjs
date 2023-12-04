import base58 from "bs58";
import { CurrencyItem } from "./item";
import { OperationFact } from "../base";
import { SortFunc } from "../../utils";
import { HINT, SUFFIX } from "../../alias";
import { Assert, ECODE, MitumError } from "../../error";
export class CreateAccountItem extends CurrencyItem {
    keys;
    addressSuffix;
    constructor(keys, amounts, addressType) {
        super(HINT.CURRENCY.CREATE_ACCOUNT.ITEM, amounts, addressType);
        this.keys = keys;
        if (addressType === "mitum") {
            this.addressSuffix = SUFFIX.ADDRESS.MITUM;
        }
        else {
            this.addressSuffix = SUFFIX.ADDRESS.ETHER;
        }
    }
    toBuffer() {
        return Buffer.concat([
            this.keys.toBuffer(),
            Buffer.from(this.addressSuffix),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            keys: this.keys.toHintedObject(),
            addrtype: this.addressSuffix
        };
    }
    toString() {
        return base58.encode(this.keys.toBuffer());
    }
}
export class CreateAccountFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CURRENCY.CREATE_ACCOUNT.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate key hash found in items"));
    }
    get operationHint() {
        return HINT.CURRENCY.CREATE_ACCOUNT.OPERATION;
    }
}
//# sourceMappingURL=create-account.js.map