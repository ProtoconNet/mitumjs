"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroAddress = exports.NodeAddress = exports.Address = void 0;
const alias_1 = require("../alias");
const node_1 = require("../node");
const common_1 = require("../common");
const error_1 = require("../error");
class BaseAddress {
    constructor(s, type) {
        this.s = s;
        if (type) {
            this.type = type;
        }
        else if (this.s.endsWith(alias_1.SUFFIX.ADDRESS.MITUM)) {
            this.type = "mitum";
        }
        else if (this.s.endsWith(alias_1.SUFFIX.ADDRESS.ETHER)) {
            this.type = "ether";
        }
        else if (this.s.endsWith(alias_1.SUFFIX.ADDRESS.NODE)) {
            this.type = "node";
        }
        else if (this.s.endsWith(alias_1.SUFFIX.ADDRESS.ZERO)) {
            this.type = "zero";
        }
        else {
            throw error_1.MitumError.detail(error_1.ECODE.INVALID_ADDRESS, "address type not detected");
        }
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}
class Address extends BaseAddress {
    constructor(s) {
        super(s);
        error_1.StringAssert.with(s, error_1.MitumError.detail(error_1.ECODE.INVALID_ADDRESS, "invalid address"))
            .empty().not()
            .endsWith(alias_1.SUFFIX.ADDRESS.MITUM, alias_1.SUFFIX.ADDRESS.ETHER)
            .satisfyConfig(node_1.Config.ADDRESS.DEFAULT)
            .excute();
    }
    static from(s) {
        return s instanceof Address ? s : new Address(s);
    }
}
exports.Address = Address;
class NodeAddress extends BaseAddress {
    constructor(s) {
        super(s, "node");
        error_1.StringAssert.with(s, error_1.MitumError.detail(error_1.ECODE.INVALID_ADDRESS, "invalid node address"))
            .empty().not()
            .endsWith(alias_1.SUFFIX.ADDRESS.NODE)
            .satisfyConfig(node_1.Config.ADDRESS.NODE)
            .excute();
    }
    static from(s) {
        return s instanceof NodeAddress ? s : new NodeAddress(s);
    }
}
exports.NodeAddress = NodeAddress;
class ZeroAddress extends BaseAddress {
    constructor(s) {
        super(s, "zero");
        error_1.StringAssert.with(s, error_1.MitumError.detail(error_1.ECODE.INVALID_ADDRESS, "invalid zero address"))
            .empty().not()
            .endsWith(alias_1.SUFFIX.ADDRESS.ZERO)
            .satisfyConfig(node_1.Config.ADDRESS.ZERO)
            .excute();
        this.currency = new common_1.CurrencyID(s.substring(0, s.length - node_1.Config.SUFFIX.ZERO_ADDRESS.value));
    }
    static from(s) {
        return s instanceof ZeroAddress ? s : new ZeroAddress(s);
    }
}
exports.ZeroAddress = ZeroAddress;
//# sourceMappingURL=address.js.map