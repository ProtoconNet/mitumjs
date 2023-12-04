"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operation = void 0;
const bs58_1 = __importDefault(require("bs58"));
const fs_1 = require("fs");
const factsign_1 = require("./factsign");
const common_1 = require("../../common");
const utils_1 = require("../../utils");
const error_1 = require("../../error");
const key_1 = require("../../key");
const types_1 = require("../../types");
class Operation {
    constructor(networkID, fact, memo) {
        this.id = networkID;
        this.memo = memo !== null && memo !== void 0 ? memo : "";
        this.fact = fact;
        this.hint = new common_1.Hint(fact.operationHint);
        this._factSigns = [];
        this._hash = Buffer.from([]);
    }
    setFactSigns(factSigns) {
        if (!factSigns) {
            return;
        }
        error_1.Assert.check(new Set(factSigns.map(fs => fs.signer.toString())).size === factSigns.length, error_1.MitumError.detail(error_1.ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"));
        this._factSigns = factSigns;
        this._hash = this.hashing();
    }
    get factSigns() {
        return this._factSigns;
    }
    get hash() {
        return this._hash;
    }
    get factSignType() {
        return this.getSigType();
    }
    getSigType(factSigns) {
        if (!factSigns) {
            factSigns = this._factSigns;
        }
        if (factSigns.length === 0) {
            return null;
        }
        const set = new Set(factSigns.map(fs => Object.getPrototypeOf(fs).constructor.name));
        error_1.Assert.check(set.size === 1, error_1.MitumError.detail(error_1.ECODE.INVALID_FACTSIGNS, "multiple sig-type in operation"));
        return Array.from(set)[0];
    }
    hashing(force) {
        let b = (0, utils_1.sha3)(this.toBuffer());
        if (force && force === "force") {
            this._hash = b;
        }
        return b;
    }
    sign(privateKey, option) {
        var _a;
        privateKey = key_1.Key.from(privateKey);
        const keypair = key_1.KeyPair.fromPrivateKey(privateKey);
        const sigType = this.factSignType;
        if (sigType === "NodeFactSign") {
            error_1.Assert.check(option !== undefined, error_1.MitumError.detail(error_1.ECODE.FAIL_SIGN, "no node address in sign option"));
        }
        const factSign = this.signWithSigType(sigType, keypair, option ? new key_1.NodeAddress((_a = option.node) !== null && _a !== void 0 ? _a : "") : undefined);
        const idx = this._factSigns
            .map((fs) => fs.signer.toString())
            .indexOf(keypair.publicKey.toString());
        if (idx < 0) {
            this._factSigns.push(factSign);
        }
        else {
            this._factSigns[idx] = factSign;
        }
        this._hash = this.hashing();
    }
    signWithSigType(sigType, keypair, node) {
        const getFactSign = (keypair, hash) => {
            const now = types_1.TimeStamp.new();
            return new factsign_1.GeneralFactSign(keypair.publicKey, keypair.sign(Buffer.concat([Buffer.from(this.id), hash, now.toBuffer()])), now.toString());
        };
        const getNodeFactSign = (node, keypair, hash) => {
            const now = types_1.TimeStamp.new();
            return new factsign_1.NodeFactSign(node.toString(), keypair.publicKey, keypair.sign(Buffer.concat([
                Buffer.from(this.id),
                node.toBuffer(),
                hash,
                now.toBuffer(),
            ])), now.toString());
        };
        const hash = this.fact.hash;
        if (sigType) {
            if (sigType == "NodeFactSign") {
                error_1.Assert.check(node !== undefined, error_1.MitumError.detail(error_1.ECODE.FAIL_SIGN, "no node address"));
                return getNodeFactSign(node, keypair, hash);
            }
            return getFactSign(keypair, hash);
        }
        else {
            if (node) {
                return getNodeFactSign(node, keypair, hash);
            }
            return getFactSign(keypair, hash);
        }
    }
    toBuffer() {
        if (!this._factSigns) {
            return this.fact.hash;
        }
        this._factSigns = this._factSigns.sort(utils_1.SortFunc);
        return Buffer.concat([
            this.fact.hash,
            Buffer.concat(this._factSigns.map((fs) => fs.toBuffer())),
        ]);
    }
    toHintedObject() {
        const op = {
            _hint: this.hint.toString(),
            fact: this.fact.toHintedObject(),
            hash: this._hash.length === 0 ? "" : bs58_1.default.encode(this._hash)
        };
        const operation = this.memo ? op : Object.assign(Object.assign({}, op), { memo: this.memo });
        const factSigns = this._factSigns.length === 0 ? [] : this._factSigns.sort(utils_1.SortFunc);
        return Object.assign(Object.assign({}, operation), { signs: factSigns.map(fs => fs.toHintedObject()) });
    }
    export(filePath) {
        (0, fs_1.writeFile)(filePath, JSON.stringify(this.toHintedObject(), null, 4), (e) => {
            if (e) {
                throw error_1.MitumError.detail(error_1.ECODE.FAIL_FILE_CREATION, "fs write-file failed");
            }
        });
    }
}
exports.Operation = Operation;
//# sourceMappingURL=operation.js.map