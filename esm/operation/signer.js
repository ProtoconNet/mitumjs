import base58 from "bs58";
import { GeneralFactSign, NodeFactSign } from "./base";
import { sha3 } from "../utils";
import { KeyPair, NodeAddress } from "../key";
import { Generator, FullTimeStamp, TimeStamp } from "../types";
import { Assert, ECODE, MitumError } from "../error";
export class Signer extends Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    sign(privatekey, json, option) {
        const keypair = KeyPair.fromPrivateKey(privatekey);
        return option ? this.nodeSign(keypair, json, option.node ?? "") : this.accSign(keypair, json);
    }
    accSign(keypair, json) {
        const now = TimeStamp.new();
        const fs = new GeneralFactSign(keypair.publicKey.toString(), keypair.sign(Buffer.concat([
            Buffer.from(this.networkID),
            base58.decode(json.fact.hash),
            now.toBuffer(),
        ])), now.toString()).toHintedObject();
        if (json.signs !== undefined) {
            json.signs = [...json.signs, fs];
        }
        else {
            json.signs = [fs];
        }
        Assert.check(new Set(json.signs.map(fs => fs.signer.toString())).size === json.signs.length, MitumError.detail(ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"));
        const factSigns = json.signs
            .map((s) => Buffer.concat([
            Buffer.from(s.signer),
            base58.decode(s.signature),
            new FullTimeStamp(s.signed_at).toBuffer("super"),
        ]));
        //.sort((a, b) => Buffer.compare(a, b))
        const msg = Buffer.concat([
            base58.decode(json.fact.hash),
            Buffer.concat(factSigns),
        ]);
        json.hash = base58.encode(sha3(msg));
        return json;
    }
    nodeSign(keypair, json, node) {
        const nd = new NodeAddress(node);
        const now = TimeStamp.new();
        const fs = new NodeFactSign(node, keypair.publicKey.toString(), keypair.sign(Buffer.concat([
            Buffer.from(this.networkID),
            nd.toBuffer(),
            base58.decode(json.fact.hash),
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
            base58.decode(s.signature),
            new FullTimeStamp(s.signed_at).toBuffer("super"),
        ]))
            .sort((a, b) => Buffer.compare(a, b));
        const msg = Buffer.concat([
            base58.decode(json.fact.hash),
            Buffer.concat(factSigns),
        ]);
        json.hash = base58.encode(sha3(msg));
        return json;
    }
}
//# sourceMappingURL=signer.js.map