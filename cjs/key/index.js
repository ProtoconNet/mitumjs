"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyG = exports.randomN = exports.KeyPair = exports.BaseKeyPair = exports.EtherKeys = exports.PubKey = exports.Keys = exports.Key = exports.NodeAddress = exports.ZeroAddress = exports.Address = void 0;
const random_1 = require("./random");
Object.defineProperty(exports, "randomN", { enumerable: true, get: function () { return random_1.randomN; } });
const pub_1 = require("./pub");
Object.defineProperty(exports, "Keys", { enumerable: true, get: function () { return pub_1.Keys; } });
Object.defineProperty(exports, "Key", { enumerable: true, get: function () { return pub_1.Key; } });
Object.defineProperty(exports, "PubKey", { enumerable: true, get: function () { return pub_1.PubKey; } });
Object.defineProperty(exports, "EtherKeys", { enumerable: true, get: function () { return pub_1.EtherKeys; } });
const keypair_1 = require("./keypair");
Object.defineProperty(exports, "BaseKeyPair", { enumerable: true, get: function () { return keypair_1.BaseKeyPair; } });
Object.defineProperty(exports, "KeyPair", { enumerable: true, get: function () { return keypair_1.KeyPair; } });
const address_1 = require("./address");
Object.defineProperty(exports, "Address", { enumerable: true, get: function () { return address_1.Address; } });
Object.defineProperty(exports, "ZeroAddress", { enumerable: true, get: function () { return address_1.ZeroAddress; } });
Object.defineProperty(exports, "NodeAddress", { enumerable: true, get: function () { return address_1.NodeAddress; } });
const types_1 = require("../types");
const error_1 = require("../error");
class KeyG extends types_1.Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    key(seed) {
        if (!seed) {
            const kp = keypair_1.KeyPair.random();
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey.toString()),
            };
        }
        const kp = keypair_1.KeyPair.fromSeed(seed);
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.address(kp.publicKey.toString()),
        };
    }
    keys(n) {
        return (0, random_1.randomN)(n).keypairs.map((kp) => {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey.toString()),
            };
        });
    }
    fromPrivateKey(key) {
        const kp = keypair_1.KeyPair.fromPrivateKey(key);
        if (kp.privateKey.type == "btc") {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey),
            };
        }
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.etherAddress(kp.publicKey),
        };
    }
    etherKey(seed) {
        if (!seed) {
            const kp = keypair_1.KeyPair.random("ether");
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            };
        }
        const kp = keypair_1.KeyPair.fromSeed(seed, "ether");
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.etherAddress(kp.publicKey),
        };
    }
    etherKeys(n) {
        return (0, random_1.randomN)(n, "ether").keypairs.map(kp => {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            };
        });
    }
    address(key) {
        const suffix = key.toString().slice(-3);
        error_1.Assert.check(suffix === "mpu", error_1.MitumError.detail(error_1.ECODE.INVALID_PUBLIC_KEY, "invalid pubkey format"));
        return new pub_1.Keys([new pub_1.PubKey(key, 100)], 100).address.toString();
    }
    etherAddress(key) {
        const suffix = key.toString().slice(-3);
        error_1.Assert.check(suffix === "epu", error_1.MitumError.detail(error_1.ECODE.INVALID_PUBLIC_KEY, "invalid pubkey format"));
        return new pub_1.EtherKeys([new pub_1.PubKey(key, 100)], 100).etherAddress.toString();
    }
    addressForMultiSig(keys, threshold) {
        return new pub_1.Keys(keys.map(k => k instanceof pub_1.PubKey ? k : new pub_1.PubKey(k.key, k.weight)), threshold).address.toString();
    }
    etherAddressForMultiSig(keys, threshold) {
        return new pub_1.EtherKeys(keys.map(k => k instanceof pub_1.PubKey ? k : new pub_1.PubKey(k.key, k.weight)), threshold).etherAddress.toString();
    }
}
exports.KeyG = KeyG;
//# sourceMappingURL=index.js.map