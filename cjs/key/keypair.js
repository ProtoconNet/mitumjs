"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyPair = exports.BaseKeyPair = void 0;
const bs58_1 = __importDefault(require("bs58"));
// import ethWallet from "ethereumjs-wallet"
const ethers_1 = require("ethers");
const secure_random_1 = __importDefault(require("secure-random"));
const eccrypto_js_1 = require("eccrypto-js");
const hmac_1 = require("@noble/hashes/hmac");
const sha256_1 = require("@noble/hashes/sha256");
const secp256k1 = __importStar(require("@noble/secp256k1"));
const crypto = __importStar(require("crypto"));
const elliptic_1 = require("elliptic");
const pub_1 = require("./pub");
const types_1 = require("../types");
const node_1 = require("../node");
const alias_1 = require("../alias");
const utils_1 = require("../utils");
const error_1 = require("../error");
const converter_1 = require("../utils/converter");
class BaseKeyPair {
    constructor(privateKey) {
        this.privateKey = privateKey;
        this.signer = this.getSigner();
        this.publicKey = this.getPub();
        secp256k1.utils.hmacSha256Sync = (key, ...msgs) => (0, hmac_1.hmac)(sha256_1.sha256, key, secp256k1.utils.concatBytes(...msgs));
        secp256k1.utils.sha256Sync = (...msgs) => (0, sha256_1.sha256)(secp256k1.utils.concatBytes(...msgs));
    }
    static random(option) {
        return this.generator.random(option);
    }
    static fromPrivateKey(key) {
        return this.generator.fromPrivateKey(key);
    }
    static fromSeed(seed, option) {
        return this.generator.fromSeed(seed, option);
    }
    btcSign(msg) {
        return Buffer.from(secp256k1.signSync((0, utils_1.sha256)((0, utils_1.sha256)(msg)), this.signer));
    }
    ethSign(msg) {
        const ec = new elliptic_1.ec("secp256k1");
        const key = ec.keyFromPrivate(this.privateKey.noSuffix, "hex");
        const msgHash = crypto.createHash("sha256").update(msg).digest();
        const signature = key.sign(msgHash);
        const r = Buffer.from(signature.r.toArray());
        const s = Buffer.from(signature.s.toArray());
        const sigLength = 4 + r.length + s.length;
        const sigBuffer = Buffer.alloc(sigLength);
        sigBuffer.writeUInt32LE(r.length, 0);
        sigBuffer.set(r, 4);
        sigBuffer.set(s, 4 + r.length);
        return sigBuffer;
    }
    btcVerify(sig, msg) {
        if (typeof sig === "string") {
            sig = Buffer.from(bs58_1.default.decode(sig));
        }
        return secp256k1.verify(sig, (0, utils_1.sha256)((0, utils_1.sha256)(msg)), secp256k1.getPublicKey(this.signer));
    }
    ethVerify(sig, msg) {
        if (typeof sig === "string") {
            sig = Buffer.from(bs58_1.default.decode(sig));
        }
        const rlen = new types_1.Big(sig.subarray(0, 4).reverse());
        const r = Buffer.alloc(rlen.v);
        const rb = new types_1.Big(sig.subarray(4, 4 + rlen.v));
        rb.toBuffer().copy(r, rlen.v - rb.byteLen());
        const s = sig.subarray(4 + rlen.v);
        const slen = new types_1.Big(s.length);
        const base = Buffer.from([48, sig.length, 2]);
        const buf = Buffer.alloc(sig.length + 2);
        base.copy(buf, 0, 0, 4);
        rlen.toBuffer().copy(buf, 3);
        r.copy(buf, 4);
        Buffer.from([2]).copy(buf, 4 + rlen.v);
        slen.toBuffer().copy(buf, 5 + rlen.v);
        s.copy(buf, 6 + rlen.v);
        return secp256k1.verify(buf, (0, utils_1.sha256)(msg), secp256k1.getPublicKey(this.signer, true));
    }
    static K(seed) {
        seed = Buffer.from(bs58_1.default.encode((0, utils_1.sha3)(Buffer.from(seed))));
        error_1.Assert.check(40 <= seed.length, error_1.MitumError.detail(error_1.ECODE.INVALID_SEED, "seed length out of range"));
        seed = seed.subarray(0, 40);
        const N = secp256k1.CURVE.n - BigInt(1);
        let k = new types_1.Big(seed).big;
        k %= N;
        k += BigInt(1);
        return k;
    }
}
exports.BaseKeyPair = BaseKeyPair;
class KeyPair extends BaseKeyPair {
    constructor(privateKey) {
        super(pub_1.Key.from(privateKey));
    }
    getSigner() {
        if (this.privateKey.type === "btc") {
            return Buffer.from(bs58_1.default.decode(this.privateKey.noSuffix));
        }
        return Buffer.from(this.privateKey.noSuffix, "hex");
    }
    getPub() {
        if (this.privateKey.type === "btc") {
            return new pub_1.Key(bs58_1.default.encode((0, eccrypto_js_1.getPublicCompressed)(Buffer.from(this.signer))) + alias_1.SUFFIX.KEY.MITUM.PUBLIC);
        }
        const publickeyBuffer = (0, converter_1.privateKeyToPublicKey)("0x" + this.privateKey.noSuffix);
        return new pub_1.Key((0, converter_1.compress)(publickeyBuffer) + alias_1.SUFFIX.KEY.ETHER.PUBLIC);
    }
    sign(msg) {
        if (this.privateKey.type === "btc") {
            return this.btcSign(msg);
        }
        return this.ethSign(msg);
    }
    verify(sig, msg) {
        if (this.privateKey.type === "btc") {
            return this.btcVerify(sig, msg);
        }
        return this.ethVerify(sig, msg);
    }
}
exports.KeyPair = KeyPair;
KeyPair.generator = {
    random(option) {
        option = option !== null && option !== void 0 ? option : "btc";
        if (option === "btc") {
            return new KeyPair(bs58_1.default.encode(Buffer.from((0, secure_random_1.default)(32, { type: "Uint8Array" }))) + alias_1.SUFFIX.KEY.MITUM.PRIVATE);
        }
        //return new KeyPair(ethWallet.generate().getPrivateKeyString().substring(2) + SUFFIX.KEY.ETHER.PRIVATE)
        return new KeyPair(ethers_1.Wallet.createRandom().privateKey.substring(2) + alias_1.SUFFIX.KEY.ETHER.PRIVATE);
    },
    fromPrivateKey(key) {
        return new KeyPair(key);
    },
    fromSeed(seed, option) {
        option = option !== null && option !== void 0 ? option : "btc";
        error_1.StringAssert.with(seed, error_1.MitumError.detail(error_1.ECODE.INVALID_SEED, "seed length out of range"))
            .satisfyConfig(node_1.Config.SEED)
            .excute();
        if (option === "btc") {
            return new KeyPair(bs58_1.default.encode(secp256k1.utils.hexToBytes(BaseKeyPair.K(seed).toString(16))) + alias_1.SUFFIX.KEY.MITUM.PRIVATE);
        }
        return new KeyPair(BaseKeyPair.K(seed).toString(16) + alias_1.SUFFIX.KEY.ETHER.PRIVATE);
    }
};
//# sourceMappingURL=keypair.js.map