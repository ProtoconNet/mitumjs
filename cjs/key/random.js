"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomN = void 0;
const pub_1 = require("./pub");
const keypair_1 = require("./keypair");
const node_1 = require("../node");
const error_1 = require("../error");
function getRandomN(n, f) {
    error_1.Assert.get(node_1.Config.KEYS_IN_ACCOUNT.satisfy(n)).excute();
    n = Math.floor(n);
    let weight = Math.floor(node_1.Config.THRESHOLD.max / n);
    if (node_1.Config.THRESHOLD.max % n) {
        weight += 1;
    }
    const ks = [];
    const kps = [];
    for (let i = 0; i < n; i++) {
        kps.push(f());
        ks.push(new pub_1.PubKey(kps[i].publicKey, weight));
    }
    return {
        keys: new pub_1.Keys(ks, node_1.Config.THRESHOLD.max),
        keypairs: kps,
    };
}
const randomN = (n, option) => {
    return getRandomN(n, () => keypair_1.KeyPair.random(option));
};
exports.randomN = randomN;
//# sourceMappingURL=random.js.map