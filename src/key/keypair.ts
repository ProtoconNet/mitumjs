import base58 from "bs58"

// import ethWallet from "ethereumjs-wallet"
import { Wallet, HDNodeWallet } from "ethers"

import { hmac } from "@noble/hashes/hmac"
import { sha256 as nobleSha256 } from "@noble/hashes/sha256"
import * as secp256k1 from "@noble/secp256k1"
import * as crypto from "crypto";
import { ec as EC } from "elliptic";

import { Key } from "./pub"
import { HDAccount, KeyPairType, defaultPath } from "./types"

import { Big } from "../types"
import { Config } from "../node"
import { SUFFIX } from "../alias"
import { sha3, sha256 } from "../utils"
import { Assert, ECODE, MitumError, StringAssert } from "../error"
import { privateKeyToPublicKey, compress } from "../utils/converter";

interface IKeyGenerator {
    random(option?: KeyPairType): BaseKeyPair
    fromPrivateKey(key: string | Key): BaseKeyPair
    fromSeed(seed: string | Buffer | Uint8Array, option?: KeyPairType): BaseKeyPair
    hdRandom(option?: KeyPairType): HDAccount
    fromPhrase(phrase: string, path?: string, option?: KeyPairType): HDAccount
}

export abstract class BaseKeyPair {
    readonly privateKey: Key
    readonly publicKey: Key
    protected signer: Uint8Array
    protected static generator: IKeyGenerator

    protected constructor(privateKey: Key) {
        this.privateKey = privateKey
        this.signer = this.getSigner()
        this.publicKey = this.getPub()

        secp256k1.utils.hmacSha256Sync = (key, ...msgs) =>
            hmac(nobleSha256, key, secp256k1.utils.concatBytes(...msgs))
        secp256k1.utils.sha256Sync = (...msgs) =>
            nobleSha256(secp256k1.utils.concatBytes(...msgs))
    }

    abstract sign(msg: string | Buffer): Buffer
    abstract verify(sig: string | Buffer, msg: string | Buffer): boolean

    protected abstract getSigner(): Uint8Array
    protected abstract getPub(): Key

    static random<T extends BaseKeyPair>(option?: KeyPairType): T {
        return this.generator.random(option) as T
    }

    static fromSeed<T extends BaseKeyPair>(seed: string | Buffer | Uint8Array, option?: KeyPairType): T {
        return this.generator.fromSeed(seed, option) as  T
    }

    static fromPrivateKey<T extends BaseKeyPair>(key: string | Key): T {
        const s = key.toString();
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_PRIVATE_KEY, "invalid private key"))
        .chainAnd(s.endsWith(SUFFIX.KEY.MITUM.PRIVATE)).excute()
        return this.generator.fromPrivateKey(key) as T
    }

    static hdRandom(option?: KeyPairType): HDAccount {
        return this.generator.hdRandom(option) as HDAccount
    }

    static fromPhrase(phrase: string, path?: string, option?: KeyPairType): HDAccount {
        return this.generator.fromPhrase(phrase, path, option) as HDAccount
    }

    protected ethSign(msg: string | Buffer): Buffer {
        const ec = new EC("secp256k1");
        const key = ec.keyFromPrivate(this.privateKey.noSuffix, "hex");

        const msgHash = crypto.createHash("sha256").update(msg).digest();
        const signature = key.sign(msgHash);
    
        const r = Buffer.from(signature.r.toArray());
        const s = Buffer.from(signature.s.toArray());
    
        const sigLength = 4 + r.length + s.length;
        const sigBuffer = Buffer.alloc(sigLength);
    
        sigBuffer.writeUInt32LE(r.length, 0);
        sigBuffer.set(r, 4);
        sigBuffer.set(s, 4 + r.length);
    
        return sigBuffer;
    }

    protected ethVerify(sig: string | Buffer, msg: string | Buffer): boolean {
        if (typeof sig === "string") {
            sig = Buffer.from(base58.decode(sig))
        }

        const rlen = new Big(sig.subarray(0, 4).reverse())
        const r = Buffer.alloc(rlen.v)

        const rb = new Big(sig.subarray(4, 4 + rlen.v))
        rb.toBuffer().copy(r, rlen.v - rb.byteLen())

        const s = sig.subarray(4 + rlen.v)
        const slen = new Big(s.length)

        const base = Buffer.from([48, sig.length, 2])

        const buf = Buffer.alloc(sig.length + 2)
        base.copy(buf, 0, 0, 4)

        rlen.toBuffer().copy(buf, 3)
        r.copy(buf, 4)

        Buffer.from([2]).copy(buf, 4 + rlen.v)

        slen.toBuffer().copy(buf, 5 + rlen.v)
        s.copy(buf, 6 + rlen.v)

        return secp256k1.verify(buf, sha256(msg), secp256k1.getPublicKey(this.signer, true))

    }

    protected static K(seed: string | Buffer | Uint8Array): bigint {
        seed = Buffer.from(base58.encode(sha3(Buffer.from(seed))))

        Assert.check(40 <= seed.length, MitumError.detail(ECODE.INVALID_SEED, "seed length out of range"))
        seed = seed.subarray(0, 40)

        const N = secp256k1.CURVE.n - BigInt(1)
        let k = new Big(seed).big
        k %= N
        k += BigInt(1)
        return k
    }
}

export class KeyPair extends BaseKeyPair {
    static generator = {
        fillHDAccount(kp: KeyPair, wallet: HDNodeWallet): HDAccount {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: "",
                phrase: wallet.mnemonic?.phrase,
                path: wallet.path
            }
        },
        random(): KeyPair {
            return new KeyPair(Wallet.createRandom().privateKey.substring(2) + SUFFIX.KEY.MITUM.PRIVATE)
        },
        fromSeed(seed: string): KeyPair {
            StringAssert.with(seed, MitumError.detail(ECODE.INVALID_SEED, `Seed must be at least 36 characters long (got ${seed.length})`))
                .satisfyConfig(Config.SEED)
                .excute()
            return new KeyPair(BaseKeyPair.K(seed).toString(16) + SUFFIX.KEY.MITUM.PRIVATE)
        },
        fromPrivateKey(key: string | Key): KeyPair {
            return new KeyPair(key)
        },
        hdRandom(): HDAccount {
            try {
                const wallet = HDNodeWallet.createRandom("", defaultPath);
                const kp = new KeyPair(wallet.privateKey.substring(2) + SUFFIX.KEY.MITUM.PRIVATE)
                return this.fillHDAccount(kp, wallet)
            } catch (error: any) {
                Assert.check(
                    false,
                    MitumError.detail(ECODE.UNKNOWN, `unknown error occur during HDNodeWallet.createRandom(), ${error.shortMessage}`)
                );
                throw error;
            }
        },
        fromPhrase(phrase: string, path?: string): HDAccount {
            try {
                const wallet = HDNodeWallet.fromPhrase(phrase, "", path ? path : defaultPath);
                const kp = new KeyPair(wallet.privateKey.substring(2) + SUFFIX.KEY.MITUM.PRIVATE);
                return this.fillHDAccount(kp, wallet);
            } catch(error: any) {
                if (error.argument === 'mnemonic') {
                    Assert.check(
                        false,
                        MitumError.detail(ECODE.HDWALLET.INVALID_PHRASE, `invalid phrase, ${error.shortMessage}`)
                    );
                } else {
                    Assert.check(
                        false,
                        MitumError.detail(ECODE.HDWALLET.INVALID_PATH, `invalid path, ${error.shortMessage} with value ${error.value}`)
                    );
                }
                throw error;
            }
        }
    }

    private constructor(privateKey: string | Key) {
        super(Key.from(privateKey))
    }

    protected getSigner(): Uint8Array {
        return Buffer.from(this.privateKey.noSuffix, "hex");
    }

    protected getPub(): Key {
        const publickeyBuffer = privateKeyToPublicKey(
            "0x" + this.privateKey.noSuffix
        );
        return new Key(compress(publickeyBuffer) + SUFFIX.KEY.MITUM.PUBLIC);
    }

    sign(msg: string | Buffer): Buffer {
        return this.ethSign(msg)
    }

    verify(sig: string | Buffer, msg: string | Buffer): boolean {
        return this.ethVerify(sig, msg)
    }
}