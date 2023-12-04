/// <reference types="node" />
import { DAOFact } from "./fact";
import { FactJson } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
export declare class RegisterFact extends DAOFact {
    readonly delegated: Address;
    constructor(token: string, sender: string | Address, contract: string | Address, proposalID: string, delegated: string | Address, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
