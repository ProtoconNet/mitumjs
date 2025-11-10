import { sha3_256, keccak256 as keccak_256 } from "js-sha3"
import { sha256 as nobleSha256 } from "@noble/hashes/sha256"
import { Buffer } from "buffer";

type HashFunction = (msg: string | Buffer) => Buffer

export const sha256: HashFunction = (msg) => Buffer.from(nobleSha256(msg))
export const sha3: HashFunction = (msg) => Buffer.from(sha3_256.create().update(msg).digest())
export const keccak256: HashFunction = (msg) => Buffer.from(keccak_256.create().update(msg).digest())

export const getChecksum = (hex: string): string => {
    const hexLower = hex.toLowerCase();
    const hash = keccak256(Buffer.from(hexLower, 'ascii')).toString('hex');
    let checksum = '';
    for (let i = 0; i < hexLower.length; i++) {
        if (parseInt(hash[i], 16) > 7) {
            checksum += hexLower[i].toUpperCase();
        } else {
            checksum += hexLower[i];
        }
    }
    return checksum
}
