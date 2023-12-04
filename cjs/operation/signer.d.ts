import { OperationJson } from "./base";
import { Key } from "../key";
import { Generator, HintedObject, IP } from "../types";
import { SignOption } from "./base/types";
export declare class Signer extends Generator {
    constructor(networkID: string, api?: string | IP);
    sign(privatekey: string | Key, json: HintedObject, option?: SignOption): OperationJson;
    private accSign;
    private nodeSign;
}
