import { M2KeyPair } from "./key.js";
import { KeyPair } from "./iPair.js";
import { Keys, PubKey } from "./publicKey.js";

import { Assert } from "../utils/error.js";
import { MitumConfig } from "../utils/config.js";

import { KeyPairType } from "../types/address.js";

function getRandomKeys(
  n: number,
  f: () => KeyPair
): { keys: Keys; keypairs: KeyPair[] } {
  Assert.get(MitumConfig.KEYS_IN_ACCOUNT.satisfy(n)).excute();

  n = Math.floor(n);

  let weight = Math.floor(MitumConfig.THRESHOLD.max / n);
  if (MitumConfig.THRESHOLD.max % n) {
    weight += 1;
  }

  const ks: PubKey[] = [];
  const kps: KeyPair[] = [];
  for (let i = 0; i < n; i++) {
    kps.push(f());
    ks.push(new PubKey(kps[i].publicKey, weight));
  }

  return {
    keys: new Keys(ks, MitumConfig.THRESHOLD.max),
    keypairs: kps,
  };
}

export const M2RandomN = (n: number, keyType: KeyPairType) => {
  return getRandomKeys(n, () => M2KeyPair.random(keyType));
};

export const M2EtherRandomN = (n: number, keyType: KeyPairType) => {
  return getRandomKeys(n, () => M2KeyPair.random(keyType));
};
