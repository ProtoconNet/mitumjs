/// <reference types="node" />
import { Item } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { HintedObject } from "../../types";
export declare abstract class CredentialItem extends Item {
    readonly contract: Address;
    readonly holder: Address;
    readonly templateID: string;
    readonly id: string;
    readonly currency: CurrencyID;
    protected constructor(hint: string, contract: string | Address, holder: string | Address, templateID: string, id: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
