"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keccak256 = exports.sha3 = exports.sha256 = void 0;
const js_sha3_1 = require("js-sha3");
const sha256_1 = require("@noble/hashes/sha256");
const sha256 = (msg) => Buffer.from((0, sha256_1.sha256)(msg));
exports.sha256 = sha256;
const sha3 = (msg) => Buffer.from(js_sha3_1.sha3_256.create().update(msg).digest());
exports.sha3 = sha3;
const keccak256 = (msg) => Buffer.from(js_sha3_1.keccak256.create().update(msg).digest());
exports.keccak256 = keccak256;
//# sourceMappingURL=hash.js.map