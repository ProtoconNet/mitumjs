/// <reference types="node" />
import { Key } from "./pub";
import { KeyPairType } from "./types";
interface IKeyGenerator {
    random(option?: KeyPairType): BaseKeyPair;
    fromPrivateKey(key: string | Key): BaseKeyPair;
    fromSeed(seed: string | Buffer | Uint8Array, option?: KeyPairType): BaseKeyPair;
}
export declare abstract class BaseKeyPair {
    readonly privateKey: Key;
    readonly publicKey: Key;
    protected signer: Uint8Array;
    protected static generator: IKeyGenerator;
    protected constructor(privateKey: Key);
    abstract sign(msg: string | Buffer): Buffer;
    abstract verify(sig: string | Buffer, msg: string | Buffer): boolean;
    protected abstract getSigner(): Uint8Array;
    protected abstract getPub(): Key;
    static random<T extends BaseKeyPair>(option?: KeyPairType): T;
    static fromPrivateKey<T extends BaseKeyPair>(key: string | Key): T;
    static fromSeed<T extends BaseKeyPair>(seed: string | Buffer | Uint8Array, option?: KeyPairType): T;
    protected btcSign(msg: string | Buffer): Buffer;
    protected ethSign(msg: string | Buffer): Buffer;
    protected btcVerify(sig: string | Buffer, msg: string | Buffer): boolean;
    protected ethVerify(sig: string | Buffer, msg: string | Buffer): boolean;
    protected static K(seed: string | Buffer | Uint8Array): bigint;
}
export declare class KeyPair extends BaseKeyPair {
    static generator: {
        random(option?: KeyPairType): KeyPair;
        fromPrivateKey(key: string | Key): KeyPair;
        fromSeed(seed: string, option?: KeyPairType): KeyPair;
    };
    private constructor();
    protected getSigner(): Uint8Array;
    protected getPub(): Key;
    sign(msg: string | Buffer): Buffer;
    verify(sig: string | Buffer, msg: string | Buffer): boolean;
}
export {};
