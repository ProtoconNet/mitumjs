import * as secp256k1 from "@noble/secp256k1";
import base58 from "bs58";
// import ethWallet from "ethereumjs-wallet";
import { sha256, Big } from "../utils/math.js";
export const isIPAddress = (item) => {
    const ipPattern = /^(http|https):\/\/(\d{1,3}\.){3}\d{1,3}(?::\d+)?$/;
    const domainPattern = /^(http|https):\/\/(?:[\w-]+\.)+[\w-]+(?::\d+)?(?:\/[\w-./?%&=]*)?$/;
    return ipPattern.test(item) || domainPattern.test(item);
};
// don't check hex of char
export const isAddress = (item) => {
    const suffix = item.slice(-3);
    if ((suffix === "mca") ||
        (suffix === "eca")) {
        return true;
    }
    return false;
};
// It hasn't been use, but maintains here.
export const verify = (addressType, signer, sig, msg) => {
    if (addressType === "btc") {
        return btcVerify(signer, sig, msg);
    }
    return ethVerify(signer, sig, msg);
};
const btcVerify = (signer, sig, msg) => {
    if (typeof sig === "string") {
        sig = Buffer.from(base58.decode(sig));
    }
    return secp256k1.verify(sig, sha256(sha256(msg)), secp256k1.getPublicKey(signer));
};
const ethVerify = (signer, sig, msg) => {
    if (typeof sig === "string") {
        sig = Buffer.from(base58.decode(sig));
    }
    const rlen = new Big(sig.subarray(0, 4).reverse());
    const r = Buffer.alloc(rlen.v);
    const rb = new Big(sig.subarray(4, 4 + rlen.v));
    rb.toBuffer().copy(r, rlen.v - rb.byteLen());
    const s = sig.subarray(4 + rlen.v);
    const slen = new Big(s.length);
    const base = Buffer.from([48, sig.length, 2]);
    const buf = Buffer.alloc(sig.length + 2);
    base.copy(buf, 0, 0, 4);
    rlen.toBuffer().copy(buf, 3);
    r.copy(buf, 4);
    Buffer.from([2]).copy(buf, 4 + rlen.v);
    slen.toBuffer().copy(buf, 5 + rlen.v);
    s.copy(buf, 6 + rlen.v);
    return secp256k1.verify(buf, sha256(msg), secp256k1.getPublicKey(signer, true));
};
//# sourceMappingURL=validation.js.map