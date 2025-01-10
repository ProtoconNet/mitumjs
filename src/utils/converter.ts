import { getPublicKey } from "@noble/secp256k1"
import { ECODE, MitumError } from "../error"

export const privateKeyToPublicKey = (
  privateKey: string | Buffer
): Uint8Array => {
  let privateBuf: Buffer;

  if (!Buffer.isBuffer(privateKey)) {
    if (typeof privateKey !== "string") {
      throw MitumError.detail(ECODE.INVALID_TYPE, "Expected Buffer or string as argument");
    }

    privateKey = privateKey.slice(0, 2) === "0x" ? privateKey.slice(2) : privateKey;
    privateBuf = Buffer.from(privateKey, "hex");
  } else {
    privateBuf = privateKey;
  }

  return getPublicKey(privateBuf, false);
};

export const compress = (publicKey: Uint8Array): string => {
  const xCoordinate = publicKey.slice(1, 33);

  const yCoordinate = publicKey.slice(33);

  const compressedPublicKey = Buffer.concat([
    Buffer.from([0x02 + (yCoordinate[yCoordinate.length - 1] % 2)]),
    xCoordinate,
  ]);

  return compressedPublicKey.toString("hex");
};
