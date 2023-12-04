"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtherKeys = exports.Keys = exports.PubKey = exports.Key = void 0;
const bs58_1 = __importDefault(require("bs58"));
const js_sha3_1 = require("js-sha3");
const address_1 = require("./address");
const common_1 = require("../common");
const node_1 = require("../node");
const alias_1 = require("../alias");
const utils_1 = require("../utils");
const error_1 = require("../error");
const types_1 = require("../types");
class Key {
    constructor(s) {
        error_1.StringAssert.with(s, error_1.MitumError.detail(error_1.ECODE.INVALID_KEY, "invalid key"))
            .empty().not()
            .chainOr(s.endsWith(alias_1.SUFFIX.KEY.MITUM.PRIVATE) && node_1.Config.KEY.MITUM.PRIVATE.satisfy(s.length), s.endsWith(alias_1.SUFFIX.KEY.ETHER.PRIVATE) && node_1.Config.KEY.ETHER.PRIVATE.satisfy(s.length), s.endsWith(alias_1.SUFFIX.KEY.MITUM.PUBLIC) && node_1.Config.KEY.MITUM.PUBLIC.satisfy(s.length), s.endsWith(alias_1.SUFFIX.KEY.ETHER.PUBLIC) && node_1.Config.KEY.ETHER.PUBLIC.satisfy(s.length))
            .excute();
        this.key = s.substring(0, s.length - node_1.Config.SUFFIX.DEFAULT.value);
        this.suffix = s.substring(s.length - node_1.Config.SUFFIX.DEFAULT.value);
        this.type = s.endsWith(alias_1.SUFFIX.KEY.ETHER.PRIVATE) || s.endsWith(alias_1.SUFFIX.KEY.ETHER.PUBLIC) ? "ether" : "btc";
        this.isPriv = s.endsWith(alias_1.SUFFIX.KEY.MITUM.PRIVATE) || s.endsWith(alias_1.SUFFIX.KEY.ETHER.PRIVATE);
    }
    static from(s) {
        return s instanceof Key ? s : new Key(s);
    }
    get noSuffix() {
        return this.key;
    }
    toBuffer() {
        return Buffer.from(this.toString());
    }
    toString() {
        return this.key + this.suffix;
    }
}
exports.Key = Key;
class PubKey extends Key {
    constructor(key, weight) {
        super(typeof key === "string" ? key : key.toString());
        this.weight = types_1.Big.from(weight);
        error_1.Assert.check(node_1.Config.WEIGHT.satisfy(this.weight.v), error_1.MitumError.detail(error_1.ECODE.INVALID_PUBLIC_KEY, "weight out of range"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.weight.toBuffer("fill")
        ]);
    }
    toHintedObject() {
        return {
            _hint: PubKey.hint.toString(),
            weight: this.weight.v,
            key: this.toString(),
        };
    }
}
exports.PubKey = PubKey;
PubKey.hint = new common_1.Hint(alias_1.HINT.CURRENCY.KEY);
class Keys {
    constructor(keys, threshold) {
        error_1.Assert.check(node_1.Config.KEYS_IN_ACCOUNT.satisfy(keys.length), error_1.MitumError.detail(error_1.ECODE.INVALID_KEYS, "keys length out of range"));
        this._keys = keys.map(k => {
            if (k instanceof PubKey) {
                return k;
            }
            const [key, weight] = k;
            return new PubKey(key instanceof Key ? key.toString() : key, weight);
        });
        this.threshold = threshold instanceof types_1.Big ? threshold : new types_1.Big(threshold);
        error_1.Assert.check(node_1.Config.THRESHOLD.satisfy(this.threshold.v), error_1.MitumError.detail(error_1.ECODE.INVALID_KEYS, "threshold out of range"));
        error_1.Assert.check(new Set(this._keys.map(k => k.toString())).size === this._keys.length, error_1.MitumError.detail(error_1.ECODE.INVALID_KEYS, "duplicate keys found in keys"));
    }
    get keys() {
        return this._keys;
    }
    get address() {
        return new address_1.Address(bs58_1.default.encode((0, utils_1.sha3)(this.toBuffer())) + alias_1.SUFFIX.ADDRESS.MITUM);
    }
    toBuffer() {
        return Buffer.concat([
            Buffer.concat(this._keys.sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer()))).map(k => k.toBuffer())),
            this.threshold.toBuffer("fill")
        ]);
    }
    toHintedObject() {
        return {
            _hint: Keys.hint.toString(),
            hash: bs58_1.default.encode((0, utils_1.sha3)(this.toBuffer())),
            keys: this._keys.sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer()))).map(k => k.toHintedObject()),
            threshold: this.threshold.v,
        };
    }
}
exports.Keys = Keys;
Keys.hint = new common_1.Hint(alias_1.HINT.CURRENCY.KEYS);
class EtherKeys {
    constructor(keys, threshold) {
        error_1.Assert.check(node_1.Config.KEYS_IN_ACCOUNT.satisfy(keys.length), error_1.MitumError.detail(error_1.ECODE.INVALID_KEYS, "keys length out of range"));
        this._keys = keys.map(k => {
            if (k instanceof PubKey) {
                return k;
            }
            const [key, weight] = k;
            return new PubKey(key instanceof Key ? key.toString() : key, weight);
        });
        this.threshold = threshold instanceof types_1.Big ? threshold : new types_1.Big(threshold);
        error_1.Assert.check(node_1.Config.THRESHOLD.satisfy(this.threshold.v), error_1.MitumError.detail(error_1.ECODE.INVALID_KEYS, "threshold out of range"));
        error_1.Assert.check(new Set(this._keys.map(k => k.toString())).size === this._keys.length, error_1.MitumError.detail(error_1.ECODE.INVALID_KEYS, "duplicate keys found in keys"));
    }
    get keys() {
        return this._keys;
    }
    get etherAddress() {
        return new address_1.Address((0, utils_1.keccak256)(this.toBuffer()).subarray(12).toString('hex') + alias_1.SUFFIX.ADDRESS.ETHER);
    }
    toBuffer() {
        return Buffer.concat([
            Buffer.concat(this._keys.sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer()))).map(k => k.toBuffer())),
            this.threshold.toBuffer("fill")
        ]);
    }
    toHintedObject() {
        const eHash = (0, js_sha3_1.keccak256)(this.toBuffer());
        return {
            _hint: EtherKeys.hint.toString(),
            hash: eHash.slice(24),
            keys: this._keys
                .sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer())))
                .map((k) => k.toHintedObject()),
            threshold: this.threshold.v,
        };
    }
}
exports.EtherKeys = EtherKeys;
EtherKeys.hint = new common_1.Hint(alias_1.HINT.CURRENCY.ETH_KEYS);
//# sourceMappingURL=pub.js.map