/// <reference types="node" />
import { Fact, FactJson } from "../base";
import { CurrencyID } from "../../common";
import { Address, EtherKeys, Keys } from "../../key";
export declare class UpdateKeyFact extends Fact {
    readonly target: Address;
    readonly keys: Keys | EtherKeys;
    readonly currency: CurrencyID;
    constructor(token: string, target: string | Address, keys: Keys | EtherKeys, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
