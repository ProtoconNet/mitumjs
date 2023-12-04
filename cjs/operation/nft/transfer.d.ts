/// <reference types="node" />
import { NFTItem } from "./item";
import { OperationFact } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { Big, HintedObject } from "../../types";
export declare class TransferItem extends NFTItem {
    readonly receiver: Address;
    readonly nft: Big;
    constructor(contract: string | Address, receiver: string | Address, nft: string | number | Big, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class TransferFact extends OperationFact<TransferItem> {
    constructor(token: string, sender: string | Address, items: TransferItem[]);
    get operationHint(): string;
}
