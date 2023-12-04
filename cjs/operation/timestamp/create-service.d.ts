/// <reference types="node" />
import { TimeStampFact } from "./fact";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
export declare class CreateServiceFact extends TimeStampFact {
    constructor(token: string, sender: string | Address, target: string | Address, currency: string | CurrencyID);
    toBuffer(): Buffer;
    get operationHint(): string;
}
