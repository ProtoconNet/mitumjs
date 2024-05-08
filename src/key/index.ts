import { KeyPairType, AddressType, Account } from "./types"

import { randomN } from "./random"
import { Keys, Key, PubKey, EtherKeys } from "./pub"
import { BaseKeyPair, KeyPair } from "./keypair"
import { Address, ZeroAddress, NodeAddress } from "./address"

import { Big, Generator, IP } from "../types"
import { Assert, ECODE, MitumError } from "../error"
import { getChecksum } from "../utils"
import { SUFFIX } from "../alias"

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

    /**
     * Generate a key pair randomly or from the given seed phrase.
	 * @param {string} [seed] - (Optional) The seed for deterministic key generation. If not provided, a random key pair will be generated.
	 * @returns An `Account` object with following properties:
	 * - `privatekey`: private key,
	 * - `publickey`: public key,
	 * - `address`: address
     */
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

    /**
     * Generate `n` length of array with randomly generated key pairs.
	 * @param {number} [n] - The number of accounts to generate.
	 * @returns An array of `Account` objects.
	 * Properties of `Account`:
	 * - `privatekey`: private key,
	 * - `publickey`: public key,
	 * - `address`: address
     */
    keys(n: number): Array<Account> {
        return randomN(n).keypairs.map((kp) => {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey.toString()),
            }
        })
    }

    /**
     * Generate a key pair from the given private key.
	 * @param {string | Key} [key] - The private key.
	 * @returns An `Account` object with following properties:
	 * - `privatekey`: private key,
	 * - `publickey`: public key,
	 * - `address`: address
     */
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

    /**
     * Generate a Ethereum style key pair randomly or from the given seed phrase.
	 * @param {string} [seed] - (Optional) The seed for deterministic key generation. If not provided, a random key pair will be generated.
	 * @returns An `Account` object with following properties:
	 * - `privatekey`: private key,
	 * - `publickey`: public key,
	 * - `address`: address
     */
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

    /**
     * Generate `n` length of array with randomly generated Ethereum style key pairs.
	 * @param {number} [n] - The number of accounts to generate.
	 * @returns An array of `Account` objects.
	 * Properties of `Account`:
	 * - `privatekey`: private key,
	 * - `publickey`: public key,
	 * - `address`: address
     */
    etherKeys(n: number): Array<Account> {
        return randomN(n, "ether").keypairs.map(kp => {
            return <Account>{
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            }
        })
    }

    /**
     * Generate an address from the given public key.
	 * @param {string | Key} [key] - The public key.
	 * @returns The address.
	 */
    address(key: string | Key): string {
        const suffix = key.toString().slice(-3);
        Assert.check(
            suffix === "mpu",
            MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid pubkey format"),
        )
        return new Keys([new PubKey(key, 100)], 100).address.toString()
    }

	/**
	 * Generate an Ethereum style address from the public key.
	 * @param {string | Key} [key] - The Ethereum style public key.
	 * @returns The checksumed Ethereum style address.
     */
    etherAddress(key: string | Key): string {
        const suffix = key.toString().slice(-3);
        Assert.check(
            suffix === "epu",
            MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid pubkey format"),
        )
        return new EtherKeys([new PubKey(key, 100)], 100).checksum.toString()
    }

    checksumedAddress(address: string) {
        try {
            const valid_address = new Address(address);
            return valid_address.toString();
        } catch(error: any) {
            if (error.code === 'EC_INVALID_ADDRESS_CHECKSUM') {
                return '0x' + getChecksum(address.slice(2, 42)) + SUFFIX.ADDRESS.MITUM
            } else {
                throw error
            }
        }
    }

    /**
     * Generate a multi-signature address from the given keys.
	 * @param {keysType} [keys] - An array of object {`key`: publickey, `weight`: weight for the key}
	 * @param {string | number | Big} [threshold] - The threshold for the multi-signature.
	 * @returns The multi-signature address.
	 * @example
	 * const pubkey01 = {
	 *     key: "p8XReXNcaRkNobtBd61uxeFUeUXJ7vWJkAYk4RuqTFJ2mpu",
	 *     weight: 50
	 * };
	 * const pubkey02 = {
	 *     key: "pTmVEh4VaPPM8iLuZcPm1qJRvhJXq8QcsEX1c3xAh4cPmpu",
	 *     weight: 50
	 * };
	 * const mutiSigAddress = mitum.account.etherAddressForMultiSig([pubkey01, pubkey02], 100);
     */
    addressForMultiSig(
        keys: keysType,
        threshold: string | number | Big,
    ): string {
        return new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold).address.toString()
    }

    /**
     * Generate a multi-signature Ethereum style address from the given keys.
	 * @param {keysType} [keys] - An array of object {`key`: publickey, `weight`: weight for the key}
	 * @param {string | number | Big} [threshold] - The threshold for the multi-signature.
	 * @returns The multi-signature Ethereum style address.
	 * @example
	 * const pubkey01 = {
	 *     key: "02cb1d73c49d638d98092e35603414b575f3f5b5ce01162cdd80ab68ab77e50e14epu",
	 *     weight: 50
	 * };
	 * const pubkey02 = {
	 *     key: "0377241675aabafca6b1a49f3bc08a581beb0daa330a4ac2008464d63ed7635a22epu",
	 *     weight: 50
	 * };
	 * const mutiSigAddress = mitum.account.etherAddressForMultiSig([pubkey01, pubkey02], 100);
     */
    etherAddressForMultiSig(
        keys: keysType,
        threshold: string | number | Big,
    ): string {
        return new EtherKeys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold).checksum.toString()
    }
}