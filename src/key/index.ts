import { KeyPairType, AddressType, Account } from "./types"

import { randomN } from "./random"
import { Keys, Key, PubKey, EtherKeys } from "./pub"
import { BaseKeyPair, KeyPair } from "./keypair"
import { Address, ZeroAddress, NodeAddress } from "./address"

import { Big, Generator, IP } from "../types"
import { Assert, ECODE, MitumError } from "../error"

export {
    KeyPairType, AddressType, Account,
    Address, ZeroAddress, NodeAddress,
    Key, Keys, PubKey, EtherKeys,
    BaseKeyPair, KeyPair,
    randomN,
}

type keysType =
    ({ key: string | Key | PubKey, weight: string | number | Big } | PubKey)[]
    | Array<{ key: string | Key | PubKey; weight: string | number | Big }>

export class KeyG extends Generator {
    constructor(networkID: string, api?: string | IP, delegateIP? : string | IP) {
        super(networkID, api, delegateIP)
    }

    key(seed?: string): Account {
        if (!seed) {
            const kp = KeyPair.random()
            return <Account>{
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey.toString()),
            }
        }

        const kp = KeyPair.fromSeed(seed)
        return <Account>{
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.address(kp.publicKey.toString()),
        }
    }

    keys(n: number): Array<Account> {
        return randomN(n).keypairs.map((kp) => {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey.toString()),
            }
        })
    }

    fromPrivateKey(key: string | Key): Account {
        const kp = KeyPair.fromPrivateKey(key)

        if (kp.privateKey.type == "btc") {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey),
            }
        }

        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.etherAddress(kp.publicKey),
        }
    }

    etherKey(seed?: string): Account {
        if (!seed) {
            const kp = KeyPair.random("ether")
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            }
        }

        const kp = KeyPair.fromSeed(seed, "ether")
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.etherAddress(kp.publicKey),
        }
    }

    etherKeys(n: number): Array<Account> {
        return randomN(n, "ether").keypairs.map(kp => {
            return <Account>{
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            }
        })
    }

    address(key: string | Key): string {
        const suffix = key.toString().slice(-3);
        Assert.check(
            suffix === "mpu",
            MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid pubkey format"),
        )
        return new Keys([new PubKey(key, 100)], 100).address.toString()
    }

    etherAddress(key: string | Key): string {
        const suffix = key.toString().slice(-3);
        Assert.check(
            suffix === "epu",
            MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid pubkey format"),
        )
        return new EtherKeys([new PubKey(key, 100)], 100).etherAddress.toString()
    }

    addressForMultiSig(
        keys: keysType,
        threshold: string | number | Big,
    ): string {
        return new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold).address.toString()
    }

    etherAddressForMultiSig(
        keys: keysType,
        threshold: string | number | Big,
    ): string {
        return new EtherKeys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold).etherAddress.toString()
    }
}