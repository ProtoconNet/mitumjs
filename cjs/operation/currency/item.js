"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyItem = void 0;
const base_1 = require("../base");
const node_1 = require("../../node");
const utils_1 = require("../../utils");
const error_1 = require("../../error");
class CurrencyItem extends base_1.Item {
    constructor(hint, amounts, addressType) {
        super(hint);
        error_1.Assert.check(node_1.Config.AMOUNTS_IN_ITEM.satisfy(amounts.length), error_1.MitumError.detail(error_1.ECODE.INVALID_AMOUNTS, "amounts length out of range"));
        error_1.Assert.check(new Set(amounts.map(am => am.currency.toString())).size === amounts.length, error_1.MitumError.detail(error_1.ECODE.INVALID_AMOUNTS, "duplicate amounts found in amounts"));
        this.amounts = amounts;
        this.addressType = addressType !== null && addressType !== void 0 ? addressType : "";
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { amounts: this.amounts.sort(utils_1.SortFunc).map(am => am.toHintedObject()) });
    }
}
exports.CurrencyItem = CurrencyItem;
//# sourceMappingURL=item.js.map