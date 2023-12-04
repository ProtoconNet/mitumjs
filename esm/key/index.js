import { randomN } from "./random";
import { Keys, Key, PubKey, EtherKeys } from "./pub";
import { BaseKeyPair, KeyPair } from "./keypair";
import { Address, ZeroAddress, NodeAddress } from "./address";
import { Generator } from "../types";
import { Assert, ECODE, MitumError } from "../error";
export { Address, ZeroAddress, NodeAddress, Key, Keys, PubKey, EtherKeys, BaseKeyPair, KeyPair, randomN, };
export class KeyG extends Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    key(seed) {
        if (!seed) {
            const kp = KeyPair.random();
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey.toString()),
            };
        }
        const kp = KeyPair.fromSeed(seed);
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.address(kp.publicKey.toString()),
        };
    }
    keys(n) {
        return randomN(n).keypairs.map((kp) => {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey.toString()),
            };
        });
    }
    fromPrivateKey(key) {
        const kp = KeyPair.fromPrivateKey(key);
        if (kp.privateKey.type == "btc") {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey),
            };
        }
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.etherAddress(kp.publicKey),
        };
    }
    etherKey(seed) {
        if (!seed) {
            const kp = KeyPair.random("ether");
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            };
        }
        const kp = KeyPair.fromSeed(seed, "ether");
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.etherAddress(kp.publicKey),
        };
    }
    etherKeys(n) {
        return randomN(n, "ether").keypairs.map(kp => {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            };
        });
    }
    address(key) {
        const suffix = key.toString().slice(-3);
        Assert.check(suffix === "mpu", MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid pubkey format"));
        return new Keys([new PubKey(key, 100)], 100).address.toString();
    }
    etherAddress(key) {
        const suffix = key.toString().slice(-3);
        Assert.check(suffix === "epu", MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid pubkey format"));
        return new EtherKeys([new PubKey(key, 100)], 100).etherAddress.toString();
    }
    addressForMultiSig(keys, threshold) {
        return new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold).address.toString();
    }
    etherAddressForMultiSig(keys, threshold) {
        return new EtherKeys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold).etherAddress.toString();
    }
}
//# sourceMappingURL=index.js.map