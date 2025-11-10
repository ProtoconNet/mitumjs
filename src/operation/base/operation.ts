import base58 from "bs58"
import { Buffer } from "buffer";

import { Fact } from "./fact"
import { SignOption } from "./types"
import { GeneralFactSign, NodeFactSign } from "./factsign"

import { Hint } from "../../common"
import { SortFunc, sha3 } from "../../utils"
import { Assert, ECODE, MitumError } from "../../error"
import { Address, NodeAddress } from "../../key/address"
import { Key } from "../../key/pub"
import { KeyPair } from "../../key/keypair"
import { HintedObject, IBuffer, IHintedObject, TimeStamp } from "../../types"

type FactSign = GeneralFactSign | NodeFactSign
type SigType = "FactSign" | "NodeFactSign" | null

export class BaseOperation<T extends Fact> implements IBuffer, IHintedObject {
    readonly id: string
    readonly hint: Hint
    readonly fact: T
    protected _factSigns: FactSign[]
    protected _hash: Buffer

    constructor(networkID: string, fact: T) {
        this.id = networkID
        this.fact = fact

        this.hint = new Hint(fact.operationHint)
        this._factSigns = []
        this._hash = Buffer.from([])
    }

    setFactSigns(factSigns: FactSign[]) {
        if (!factSigns) {
            return
        }

        Assert.check(
            new Set(factSigns.map(fs => fs.signer.toString())).size === factSigns.length,
            MitumError.detail(ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"),
        )

        this._factSigns = factSigns
        this._hash = this.hashing()
    }

    get factSigns() {
        return this._factSigns
    }

    get hash() {
        return this._hash
    }

    get factSignType() {
        return this.getSigType()
    }

    private getSigType(factSigns?: FactSign[]): SigType {
        if (!factSigns) {
            factSigns = this._factSigns
        }

        if (factSigns.length === 0) {
            return null
        }

        const set = new Set(factSigns.map(fs => Object.getPrototypeOf(fs).constructor.name))
        Assert.check(set.size === 1, MitumError.detail(ECODE.INVALID_FACTSIGNS, "multiple sig-type in operation"))

        return Array.from(set)[0]
    }

    hashing(force?: "force") {
        let b: Buffer = sha3(this.toBuffer())

        if (force && force === "force") {
            this._hash = b
        }

        return b
    }

    sign(privateKey: string | Key, option?: SignOption) {
        privateKey = Key.from(privateKey)
        const keypair = KeyPair.fromPrivateKey<KeyPair>(privateKey)
        const sigType = this.factSignType

        if (sigType === "NodeFactSign") {
            Assert.check(option !== undefined, MitumError.detail(ECODE.FAIL_SIGN, "no node address in sign option"))
        }

        const factSign = this.signWithSigType(sigType, keypair, option ? new NodeAddress(option.node ?? "") : undefined)

        const idx = this._factSigns
            .map((fs) => fs.signer.toString())
            .indexOf(keypair.publicKey.toString())

        if (idx < 0) {
            this._factSigns.push(factSign)
        } else {
            this._factSigns[idx] = factSign
        }

        this._hash = this.hashing()
    }

    private signWithSigType(sigType: SigType, keypair: KeyPair, node: Address | undefined) {
        const getFactSign = (keypair: KeyPair, hash: Buffer) => {
            const now = TimeStamp.new()

            return new GeneralFactSign(
                keypair.publicKey,
                keypair.sign(Buffer.concat([Buffer.from(this.id), hash, now.toBuffer()])),
                now.toString(),
            )
        }
        const getNodeFactSign = (node: Address, keypair: KeyPair, hash: Buffer) => {
            const now = TimeStamp.new()

            return new NodeFactSign(
                node.toString(),
                keypair.publicKey,
                keypair.sign(Buffer.concat([
                    Buffer.from(this.id),
                    node.toBuffer(),
                    hash,
                    now.toBuffer(),
                ])),
                now.toString(),
            )
        }

        const hash = this.fact.hash;

        if (sigType) {
            if (sigType == "NodeFactSign") {
                Assert.check(node !== undefined, MitumError.detail(ECODE.FAIL_SIGN, "no node address"))
                return getNodeFactSign(node as Address, keypair, hash)
            }
            return getFactSign(keypair, hash)
        } else {
            if (node) {
                return getNodeFactSign(node, keypair, hash)
            }
            return getFactSign(keypair, hash)
        }
    }

    toBuffer(): Buffer {
        if (!this._factSigns) {
            return this.fact.hash
        }

        this._factSigns = this._factSigns.sort(SortFunc)

        return Buffer.concat([
            this.fact.hash,
            Buffer.concat(this._factSigns.map((fs) => fs.toBuffer())),
        ])
    }

    toHintedObject(): HintedObject {
        const operation = {
            _hint: this.hint.toString(),
            fact: this.fact.toHintedObject(),
            hash: this._hash.length === 0 ? "" : base58.encode(this._hash)
        }

        const factSigns = this._factSigns.length === 0 ? [] : this._factSigns.sort(SortFunc)

        return {
            ...operation,
            signs: factSigns.map(fs => fs.toHintedObject())
        }
    }

    // export(filePath: string) {
    //     writeFile(filePath, JSON.stringify(this.toHintedObject(), null, 4), (e) => {
    //         if (e) {
    //             throw MitumError.detail(ECODE.FAIL_FILE_CREATION, "fs write-file failed")
    //         }
    //     })
    // }
}