import { keccak256 as keccak256js } from "js-sha3";

import { Address } from "./address"
import { KeyPairType } from "./types"

import { Hint } from "../common"
import { Config } from "../node/config"
import { HINT, SUFFIX } from "../alias"
import { keccak256 } from "../utils/hash"
import { Assert, ECODE, MitumError, StringAssert } from "../error"
import { Big, HintedObject, IBuffer, IHintedObject, IString } from "../types"

type BigArg = string | number | Big
type Pub = [string | Key, BigArg] | PubKey

export class Key implements IBuffer, IString {
    private readonly key: string
    private readonly suffix: string
    readonly type: KeyPairType
    readonly isPriv: boolean

    constructor(s: string) {
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_KEY, "invalid key"))
        .empty().not()
        .chainOr(
            s.endsWith(SUFFIX.KEY.MITUM.PRIVATE),
            s.endsWith(SUFFIX.KEY.MITUM.PUBLIC),
        )
        .excute()

        if (s.endsWith(SUFFIX.KEY.MITUM.PRIVATE)) {
            StringAssert.with(s, MitumError.detail(ECODE.INVALID_PRIVATE_KEY, "invalid private key"))
            .chainAnd(
                s.endsWith(SUFFIX.KEY.MITUM.PRIVATE) && Config.KEY.MITUM.PRIVATE.satisfy(s.length),
                /^[0-9a-f]+$/.test(s.substring(0, s.length - Config.SUFFIX.DEFAULT.value!)))
            .excute()
        } else {
            StringAssert.with(s, MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid public key"))
            .chainAnd(
                s.endsWith(SUFFIX.KEY.MITUM.PUBLIC) && Config.KEY.MITUM.PUBLIC.satisfy(s.length),
                /^[0-9a-f]+$/.test(s.substring(0, s.length - Config.SUFFIX.DEFAULT.value!))
            )
            .excute()
        }

        this.key = s.substring(0, s.length - Config.SUFFIX.DEFAULT.value!)
        this.suffix = s.substring(s.length - Config.SUFFIX.DEFAULT.value!)

        this.type = "mitum"
        this.isPriv = s.endsWith(SUFFIX.KEY.MITUM.PRIVATE)
    }

    static from(s: string | Key) {
        return s instanceof Key ? s : new Key(s)
    }

    get noSuffix(): string {
        return this.key
    }

    toBuffer(): Buffer {
        return Buffer.from(this.toString())
    }

    toString(): string {
        return this.key + this.suffix
    }
}

export class PubKey extends Key implements IHintedObject {
    private static hint = new Hint(HINT.CURRENCY.KEY)
    readonly weight: Big

    constructor(key: string | Key, weight: number | string | Big) {
        super(typeof key === "string" ? key : key.toString())
        this.weight = Big.from(weight)

        const s = key.toString();
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid public key"))
            .chainAnd(s.endsWith(SUFFIX.KEY.MITUM.PUBLIC))
            .excute();

        Assert.check(
            Config.WEIGHT.satisfy(this.weight.v),
            MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "weight out of range")
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.weight.toBuffer("fill")
        ])
    }

    toHintedObject(): HintedObject {
        return {
            _hint: PubKey.hint.toString(),
            weight: this.weight.v,
            key: this.toString(),
        }
    }
}

export class Keys implements IBuffer, IHintedObject {
    private static hint = new Hint(HINT.CURRENCY.KEYS)
    private readonly _keys: PubKey[]
    readonly threshold: Big

    constructor(keys: Pub[], threshold: BigArg) {
        Assert.check(
            Config.KEYS_IN_ACCOUNT.satisfy(keys.length),
            MitumError.detail(ECODE.INVALID_KEYS, "keys length out of range")
        )

        this._keys = keys.map(
            k => {
                if (k instanceof PubKey) {
                    return k
                }

                const [key, weight] = k
                return new PubKey(key instanceof Key ? key.toString() : key, weight)
            }
        )
        this.threshold = threshold instanceof Big ? threshold : new Big(threshold)
        
        const _sum = this._keys.reduce((total, key) => total + key.weight.v, 0);
        Assert.check(
            this.threshold.v <= _sum,
            MitumError.detail(ECODE.INVALID_KEYS, `sum of weights under threshold, ${_sum} < ${this.threshold.v}`)
        )
        Assert.check(
            Config.THRESHOLD.satisfy(this.threshold.v),
            MitumError.detail(ECODE.INVALID_KEYS, "threshold out of range")
        )
        Assert.check(
            new Set(this._keys.map(k => k.toString())).size === this._keys.length,
            MitumError.detail(ECODE.INVALID_KEYS, "duplicate keys found in keys")
        )
    }

    get keys(): PubKey[] {
        return this._keys
    }

    get checksum(): Address {
        const address = keccak256(this.toBuffer()).subarray(12).toString('hex');
        const hash = keccak256(Buffer.from(address, 'ascii')).toString('hex');
        let checksumAddress = '0x';
        for (let i = 0; i < address.length; i++) {
            if (parseInt(hash[i], 16) > 7) {
                checksumAddress += address[i].toUpperCase();
            } else {
                checksumAddress += address[i];
            }
        }
        // use mitum SUFFIX temporarily
        return new Address(checksumAddress + SUFFIX.ADDRESS.MITUM)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            Buffer.concat(this._keys.sort(
                (a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer()))
            ).map(k => k.toBuffer())),
            this.threshold.toBuffer("fill")
        ])
    }

    toHintedObject(): HintedObject {
        const eHash = keccak256js(this.toBuffer());
        return {
            _hint: Keys.hint.toString(),
            hash: eHash.slice(24),
            keys: this._keys
            .sort((a, b) =>
              Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer()))
            )
            .map((k) => k.toHintedObject()),
          threshold: this.threshold.v,
        }
    }
}