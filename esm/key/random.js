import { Keys, PubKey } from "./pub";
import { KeyPair } from "./keypair";
import { Config } from "../node";
import { Assert } from "../error";
function getRandomN(n, f) {
    Assert.get(Config.KEYS_IN_ACCOUNT.satisfy(n)).excute();
    n = Math.floor(n);
    let weight = Math.floor(Config.THRESHOLD.max / n);
    if (Config.THRESHOLD.max % n) {
        weight += 1;
    }
    const ks = [];
    const kps = [];
    for (let i = 0; i < n; i++) {
        kps.push(f());
        ks.push(new PubKey(kps[i].publicKey, weight));
    }
    return {
        keys: new Keys(ks, Config.THRESHOLD.max),
        keypairs: kps,
    };
}
export const randomN = (n, option) => {
    return getRandomN(n, () => KeyPair.random(option));
};
//# sourceMappingURL=random.js.map