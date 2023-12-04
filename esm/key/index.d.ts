import { KeyPairType, AddressType, Account } from "./types";
import { randomN } from "./random";
import { Keys, Key, PubKey, EtherKeys } from "./pub";
import { BaseKeyPair, KeyPair } from "./keypair";
import { Address, ZeroAddress, NodeAddress } from "./address";
import { Big, Generator, IP } from "../types";
export { KeyPairType, AddressType, Account, Address, ZeroAddress, NodeAddress, Key, Keys, PubKey, EtherKeys, BaseKeyPair, KeyPair, randomN, };
type keysType = ({
    key: string | Key | PubKey;
    weight: string | number | Big;
} | PubKey)[] | Array<{
    key: string | Key | PubKey;
    weight: string | number | Big;
}>;
export declare class KeyG extends Generator {
    constructor(networkID: string, api?: string | IP);
    key(seed?: string): Account;
    keys(n: number): Array<Account>;
    fromPrivateKey(key: string | Key): Account;
    etherKey(seed?: string): Account;
    etherKeys(n: number): Array<Account>;
    address(key: string | Key): string;
    etherAddress(key: string | Key): string;
    addressForMultiSig(keys: keysType, threshold: string | number | Big): string;
    etherAddressForMultiSig(keys: keysType, threshold: string | number | Big): string;
}
