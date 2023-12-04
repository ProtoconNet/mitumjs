import { getPublicKey } from "@noble/secp256k1";
export const privateKeyToPublicKey = (privateKey) => {
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
    return getPublicKey(privateBuf, false);
};
export const compress = (publicKey) => {
    const xCoordinate = publicKey.slice(1, 33);
    const yCoordinate = publicKey.slice(33);
    const compressedPublicKey = Buffer.concat([
        Buffer.from([0x02 + (yCoordinate[yCoordinate.length - 1] % 2)]),
        xCoordinate,
    ]);
    return compressedPublicKey.toString("hex");
};
//# sourceMappingURL=converter.js.map