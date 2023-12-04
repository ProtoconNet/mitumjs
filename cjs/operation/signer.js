"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signer = void 0;
const bs58_1 = __importDefault(require("bs58"));
const base_1 = require("./base");
const utils_1 = require("../utils");
const key_1 = require("../key");
const types_1 = require("../types");
const error_1 = require("../error");
class Signer extends types_1.Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    sign(privatekey, json, option) {
        var _a;
        const keypair = key_1.KeyPair.fromPrivateKey(privatekey);
        return option ? this.nodeSign(keypair, json, (_a = option.node) !== null && _a !== void 0 ? _a : "") : this.accSign(keypair, json);
    }
    accSign(keypair, json) {
        const now = types_1.TimeStamp.new();
        const fs = new base_1.GeneralFactSign(keypair.publicKey.toString(), keypair.sign(Buffer.concat([
            Buffer.from(this.networkID),
            bs58_1.default.decode(json.fact.hash),
            now.toBuffer(),
        ])), now.toString()).toHintedObject();
        if (json.signs !== undefined) {
            json.signs = [...json.signs, fs];
        }
        else {
            json.signs = [fs];
        }
        error_1.Assert.check(new Set(json.signs.map(fs => fs.signer.toString())).size === json.signs.length, error_1.MitumError.detail(error_1.ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"));
        const factSigns = json.signs
            .map((s) => Buffer.concat([
            Buffer.from(s.signer),
            bs58_1.default.decode(s.signature),
            new types_1.FullTimeStamp(s.signed_at).toBuffer("super"),
        ]));
        //.sort((a, b) => Buffer.compare(a, b))
        const msg = Buffer.concat([
            bs58_1.default.decode(json.fact.hash),
            Buffer.concat(factSigns),
        ]);
        json.hash = bs58_1.default.encode((0, utils_1.sha3)(msg));
        return json;
    }
    nodeSign(keypair, json, node) {
        const nd = new key_1.NodeAddress(node);
        const now = types_1.TimeStamp.new();
        const fs = new base_1.NodeFactSign(node, keypair.publicKey.toString(), keypair.sign(Buffer.concat([
            Buffer.from(this.networkID),
            nd.toBuffer(),
            bs58_1.default.decode(json.fact.hash),
            now.toBuffer(),
        ])), now.toString()).toHintedObject();
        if (json.signs) {
            json.signs = [...json.signs, fs];
        }
        else {
            json.signs = [fs];
        }
        const factSigns = json.signs
            .map((s) => Buffer.concat([
            Buffer.from(s.signer),
            bs58_1.default.decode(s.signature),
            new types_1.FullTimeStamp(s.signed_at).toBuffer("super"),
        ]))
            .sort((a, b) => Buffer.compare(a, b));
        const msg = Buffer.concat([
            bs58_1.default.decode(json.fact.hash),
            Buffer.concat(factSigns),
        ]);
        json.hash = bs58_1.default.encode((0, utils_1.sha3)(msg));
        return json;
    }
}
exports.Signer = Signer;
//# sourceMappingURL=signer.js.map