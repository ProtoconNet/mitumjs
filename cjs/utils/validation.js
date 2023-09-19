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
exports.verify = exports.isAddress = exports.isIPAddress = void 0;
const secp256k1 = __importStar(require("@noble/secp256k1"));
const bs58_1 = __importDefault(require("bs58"));
// import ethWallet from "ethereumjs-wallet";
const math_js_1 = require("../utils/math.js");
const isIPAddress = (item) => {
    const ipPattern = /^(http|https):\/\/(\d{1,3}\.){3}\d{1,3}(?::\d+)?$/;
    const domainPattern = /^(http|https):\/\/(?:[\w-]+\.)+[\w-]+(?::\d+)?(?:\/[\w-./?%&=]*)?$/;
    return ipPattern.test(item) || domainPattern.test(item);
};
exports.isIPAddress = isIPAddress;
// don't check hex of char
const isAddress = (item) => {
    const suffix = item.slice(-3);
    if ((suffix === "mca") ||
        (suffix === "eca")) {
        return true;
    }
    return false;
};
exports.isAddress = isAddress;
// It hasn't been use, but maintains here.
const verify = (addressType, signer, sig, msg) => {
    if (addressType === "btc") {
        return btcVerify(signer, sig, msg);
    }
    return ethVerify(signer, sig, msg);
};
exports.verify = verify;
const btcVerify = (signer, sig, msg) => {
    if (typeof sig === "string") {
        sig = Buffer.from(bs58_1.default.decode(sig));
    }
    return secp256k1.verify(sig, (0, math_js_1.sha256)((0, math_js_1.sha256)(msg)), secp256k1.getPublicKey(signer));
};
const ethVerify = (signer, sig, msg) => {
    if (typeof sig === "string") {
        sig = Buffer.from(bs58_1.default.decode(sig));
    }
    const rlen = new math_js_1.Big(sig.subarray(0, 4).reverse());
    const r = Buffer.alloc(rlen.v);
    const rb = new math_js_1.Big(sig.subarray(4, 4 + rlen.v));
    rb.toBuffer().copy(r, rlen.v - rb.byteLen());
    const s = sig.subarray(4 + rlen.v);
    const slen = new math_js_1.Big(s.length);
    const base = Buffer.from([48, sig.length, 2]);
    const buf = Buffer.alloc(sig.length + 2);
    base.copy(buf, 0, 0, 4);
    rlen.toBuffer().copy(buf, 3);
    r.copy(buf, 4);
    Buffer.from([2]).copy(buf, 4 + rlen.v);
    slen.toBuffer().copy(buf, 5 + rlen.v);
    s.copy(buf, 6 + rlen.v);
    return secp256k1.verify(buf, (0, math_js_1.sha256)(msg), secp256k1.getPublicKey(signer, true));
};
//# sourceMappingURL=validation.js.map