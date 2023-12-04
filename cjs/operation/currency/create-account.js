"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountFact = exports.CreateAccountItem = void 0;
const bs58_1 = __importDefault(require("bs58"));
const item_1 = require("./item");
const base_1 = require("../base");
const utils_1 = require("../../utils");
const alias_1 = require("../../alias");
const error_1 = require("../../error");
class CreateAccountItem extends item_1.CurrencyItem {
    constructor(keys, amounts, addressType) {
        super(alias_1.HINT.CURRENCY.CREATE_ACCOUNT.ITEM, amounts, addressType);
        this.keys = keys;
        if (addressType === "mitum") {
            this.addressSuffix = alias_1.SUFFIX.ADDRESS.MITUM;
        }
        else {
            this.addressSuffix = alias_1.SUFFIX.ADDRESS.ETHER;
        }
    }
    toBuffer() {
        return Buffer.concat([
            this.keys.toBuffer(),
            Buffer.from(this.addressSuffix),
            Buffer.concat(this.amounts.sort(utils_1.SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { keys: this.keys.toHintedObject(), addrtype: this.addressSuffix });
    }
    toString() {
        return bs58_1.default.encode(this.keys.toBuffer());
    }
}
exports.CreateAccountItem = CreateAccountItem;
class CreateAccountFact extends base_1.OperationFact {
    constructor(token, sender, items) {
        super(alias_1.HINT.CURRENCY.CREATE_ACCOUNT.FACT, token, sender, items);
        error_1.Assert.check(new Set(items.map(it => it.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate key hash found in items"));
    }
    get operationHint() {
        return alias_1.HINT.CURRENCY.CREATE_ACCOUNT.OPERATION;
    }
}
exports.CreateAccountFact = CreateAccountFact;
//# sourceMappingURL=create-account.js.map