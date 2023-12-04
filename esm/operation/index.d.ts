import { SignOption, Operation as OP, Fact } from "./base";
import { Currency, Account, Contract } from "./currency";
import { NFT } from "./nft";
import { Credential } from "./credential";
import { DAO } from "./dao";
import { STO } from "./sto";
import { KYC } from "./kyc";
import { TimeStamp } from "./timestamp";
import { Token } from "./token";
import { Point } from "./point";
import { Signer } from "./signer";
import { Key, KeyPair } from "../key";
import { Generator, HintedObject, IP } from "../types";
import * as Base from "./base";
export declare class Operation extends Generator {
    constructor(networkID: string, api?: string | IP);
    getAllOperations(): Promise<import("axios").AxiosResponse<any, any>>;
    getOperation(hash: string): Promise<import("axios").AxiosResponse<any, any>>;
    sign(privatekey: string | Key | KeyPair, operation: OP<Fact>, option?: SignOption): OP<Fact>;
    send(operation: string | HintedObject, headers?: {
        [i: string]: any;
    }): Promise<import("axios").AxiosResponse<any, any>>;
}
export { Currency, Account, Contract, NFT, Credential, DAO, STO, KYC, TimeStamp, Token, Point, Signer, Base, };
