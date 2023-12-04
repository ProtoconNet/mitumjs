"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFact = exports.ContractFact = exports.OperationFact = exports.Fact = void 0;
const bs58_1 = __importDefault(require("bs58"));
const node_1 = require("../../node");
const key_1 = require("../../key");
const utils_1 = require("../../utils");
const common_1 = require("../../common");
const error_1 = require("../../error");
class Fact {
    constructor(hint, token) {
        this.hint = new common_1.Hint(hint);
        this.token = new common_1.Token(token);
        this._hash = Buffer.from([]);
    }
    get hash() {
        return this._hash;
    }
    hashing() {
        return (0, utils_1.sha3)(this.toBuffer());
    }
    toBuffer() {
        return this.token.toBuffer();
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            hash: bs58_1.default.encode(this.hash ? this.hash : []),
            token: this.token.toString()
        };
    }
}
exports.Fact = Fact;
class OperationFact extends Fact {
    constructor(hint, token, sender, items) {
        super(hint, token);
        this.sender = key_1.Address.from(sender);
        error_1.Assert.check(node_1.Config.ITEMS_IN_FACT.satisfy(items.length));
        error_1.Assert.check(new Set(items.map(i => i.toString())).size === items.length, error_1.MitumError.detail(error_1.ECODE.INVALID_ITEMS, "duplicate items found"));
        this.items = items;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            Buffer.concat(this.items.sort(utils_1.SortFunc).map((i) => i.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), items: this.items.sort(utils_1.SortFunc).map(i => i.toHintedObject()) });
    }
}
exports.OperationFact = OperationFact;
class ContractFact extends Fact {
    constructor(hint, token, sender, contract, currency) {
        super(hint, token);
        this.sender = key_1.Address.from(sender);
        this.contract = key_1.Address.from(contract);
        this.currency = common_1.CurrencyID.from(currency);
        error_1.Assert.check(this.sender.toString() !== this.contract.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "sender is same with contract address"));
        // this._hash = this.hashing()
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), contract: this.contract.toString(), currency: this.currency.toString() });
    }
}
exports.ContractFact = ContractFact;
class NodeFact extends Fact {
    constructor(hint, token) {
        super(hint, token);
    }
}
exports.NodeFact = NodeFact;
//# sourceMappingURL=fact.js.map