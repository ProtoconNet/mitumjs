import { KeyPairType } from "./types"
import { Keys, PubKey } from "./pub"
import { BaseKeyPair, KeyPair } from "./keypair"

import { Config } from "../node"
import { Assert, ECODE, MitumError} from "../error"

function getRandomN(n: number, f: () => BaseKeyPair): { keys: Keys, keypairs: BaseKeyPair[] } {
    Assert.check(
        Config.KEYS_IN_ACCOUNT.satisfy(n),
        MitumError.detail(ECODE.INVALID_KEYS, `${n} is out of range`)
    )

    n = Math.floor(n)

    let weight = Math.floor(Config.THRESHOLD.max / n)
    if (Config.THRESHOLD.max % n) {
        weight += 1
    }

    const ks = []
    const kps = []
    for (let i = 0; i < n; i++) {
        kps.push(f())
        ks.push(new PubKey(kps[i].publicKey, weight))
    }

    return {
        keys: new Keys(ks, Config.THRESHOLD.max),
        keypairs: kps,
    }
}

export const randomN = (n: number, option?: KeyPairType) => {
    return getRandomN(n, () => KeyPair.random(option))
}