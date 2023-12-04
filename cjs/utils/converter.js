"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compress = exports.privateKeyToPublicKey = void 0;
const secp256k1_1 = require("@noble/secp256k1");
const privateKeyToPublicKey = (privateKey) => {
    let privateBuf;
    if (!Buffer.isBuffer(privateKey)) {
        if (typeof privateKey !== "string") {
            throw new Error("Expected Buffer or string as argument");
        }
        privateKey =
            privateKey.slice(0, 2) === "0x" ? privateKey.slice(2) : privateKey;
        privateBuf = Buffer.from(privateKey, "hex");
    }
    else {
        privateBuf = privateKey;
    }
    return (0, secp256k1_1.getPublicKey)(privateBuf, false);
};
exports.privateKeyToPublicKey = privateKeyToPublicKey;
const compress = (publicKey) => {
    const xCoordinate = publicKey.slice(1, 33);
    const yCoordinate = publicKey.slice(33);
    const compressedPublicKey = Buffer.concat([
        Buffer.from([0x02 + (yCoordinate[yCoordinate.length - 1] % 2)]),
        xCoordinate,
    ]);
    return compressedPublicKey.toString("hex");
};
exports.compress = compress;
//# sourceMappingURL=converter.js.map