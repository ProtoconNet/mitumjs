import base58 from "bs58"
import { OperationJson, GeneralFactSign, NodeFactSign } from "./base"

import { sha3 } from "../utils"
import { Key, KeyPair, NodeAddress } from "../key"
import { Generator, HintedObject, FullTimeStamp, TimeStamp, IP } from "../types"
import { SignOption } from "./base/types"
import { Assert, ECODE, MitumError } from "../error"

export class Signer extends Generator {

    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }
    
    sign(
        privatekey: string | Key,
        operation: HintedObject,
        option?: SignOption
    ) {
        const keypair = KeyPair.fromPrivateKey(privatekey)
        return option ? this.nodeSign(keypair as KeyPair, operation as OperationJson, option.node ?? "") : this.accSign(keypair as KeyPair, operation as OperationJson)
    }

    private accSign(keypair: KeyPair, operation: OperationJson) {
        const now = TimeStamp.new()

        const fs = new GeneralFactSign(
            keypair.publicKey.toString(),
            keypair.sign(
                Buffer.concat([
                    Buffer.from(this.networkID),
                    base58.decode(operation.fact.hash),
                    now.toBuffer(),
                ])
            ),
            now.toString(),
        ).toHintedObject()

        if (operation.signs !== undefined) {
            operation.signs = [...operation.signs, fs]
        } else {
            operation.signs = [fs]
        }

        Assert.check(
            new Set(operation.signs.map(fs => fs.signer.toString())).size === operation.signs.length,
            MitumError.detail(ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"),
        )

        const factSigns = operation.signs
            .map((s) =>
                Buffer.concat([
                    Buffer.from(s.signer),
                    base58.decode(s.signature),
                    new FullTimeStamp(s.signed_at).toBuffer("super"),
                ])
            )
            //.sort((a, b) => Buffer.compare(a, b))

        const msg = Buffer.concat([
            base58.decode(operation.fact.hash),
            Buffer.concat(factSigns),
        ])

        operation.hash = base58.encode(sha3(msg))

        return operation
    }


    private nodeSign(keypair: KeyPair, operation: OperationJson, node: string) {
        const nd = new NodeAddress(node)
        const now = TimeStamp.new()
        const fs = new NodeFactSign(
            node,
            keypair.publicKey.toString(),
            keypair.sign(
                Buffer.concat([
                    Buffer.from(this.networkID),
                    nd.toBuffer(),
                    base58.decode(operation.fact.hash),
                    now.toBuffer(),
                ])
            ),
            now.toString(),
        ).toHintedObject()

        if (operation.signs) {
            operation.signs = [...operation.signs, fs]
        } else {
            operation.signs = [fs]
        }

        const factSigns = operation.signs
            .map((s) =>
                Buffer.concat([
                    Buffer.from(s.signer),
                    base58.decode(s.signature),
                    new FullTimeStamp(s.signed_at).toBuffer("super"),
                ])
            )
            .sort((a, b) => Buffer.compare(a, b))

        const msg = Buffer.concat([
            base58.decode(operation.fact.hash),
            Buffer.concat(factSigns),
        ])

        operation.hash = base58.encode(sha3(msg))

        return operation
    }
}