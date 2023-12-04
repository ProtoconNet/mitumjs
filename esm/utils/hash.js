import { sha3_256, keccak256 as keccak_256 } from "js-sha3";
import { sha256 as nobleSha256 } from "@noble/hashes/sha256";
export const sha256 = (msg) => Buffer.from(nobleSha256(msg));
export const sha3 = (msg) => Buffer.from(sha3_256.create().update(msg).digest());
export const keccak256 = (msg) => Buffer.from(keccak_256.create().update(msg).digest());
//# sourceMappingURL=hash.js.map