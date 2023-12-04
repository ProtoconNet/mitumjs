"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFactSign = exports.GeneralFactSign = exports.FactSign = void 0;
const bs58_1 = __importDefault(require("bs58"));
const types_1 = require("../../types");
const key_1 = require("../../key");
const error_1 = require("../../error");
class FactSign {
    constructor(signer, signature, signedAt) {
        this.signature = signature;
        this.signedAt = new types_1.FullTimeStamp(signedAt);
        this.signer = key_1.Key.from(signer);
        error_1.Assert.get(this.signer.isPriv, error_1.MitumError.detail(error_1.ECODE.INVALID_PUBLIC_KEY, "not public key")).not().excute();
    }
    toBuffer() {
        return Buffer.concat([
            this.signer.toBuffer(),
            this.signature,
            this.signedAt.toBuffer("super")
        ]);
    }
    toHintedObject() {
        return {
            signer: this.signer.toString(),
            signature: bs58_1.default.encode(this.signature),
            signed_at: this.signedAt.ISO(),
        };
    }
}
exports.FactSign = FactSign;
class GeneralFactSign extends FactSign {
    constructor(signer, signature, signedAt) {
        super(signer, signature, signedAt);
    }
    toHintedObject() {
        return super.toHintedObject();
    }
}
exports.GeneralFactSign = GeneralFactSign;
class NodeFactSign extends FactSign {
    constructor(node, signer, signature, signedAt) {
        super(signer, signature, signedAt);
        this.node = key_1.NodeAddress.from(node);
    }
    toBuffer() {
        return Buffer.concat([
            this.node.toBuffer(),
            super.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { node: this.node.toString() });
    }
}
exports.NodeFactSign = NodeFactSign;
//# sourceMappingURL=factsign.js.map