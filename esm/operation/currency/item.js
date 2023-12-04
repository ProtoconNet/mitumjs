import { Item } from "../base";
import { Config } from "../../node";
import { SortFunc } from "../../utils";
import { Assert, ECODE, MitumError } from "../../error";
export class CurrencyItem extends Item {
    amounts;
    addressType;
    constructor(hint, amounts, addressType) {
        super(hint);
        Assert.check(Config.AMOUNTS_IN_ITEM.satisfy(amounts.length), MitumError.detail(ECODE.INVALID_AMOUNTS, "amounts length out of range"));
        Assert.check(new Set(amounts.map(am => am.currency.toString())).size === amounts.length, MitumError.detail(ECODE.INVALID_AMOUNTS, "duplicate amounts found in amounts"));
        this.amounts = amounts;
        this.addressType = addressType ?? "";
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            amounts: this.amounts.sort(SortFunc).map(am => am.toHintedObject()),
        };
    }
}
//# sourceMappingURL=item.js.map