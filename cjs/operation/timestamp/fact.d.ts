import { ContractFact, FactJson } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
export declare abstract class TimeStampFact extends ContractFact {
    protected constructor(hint: string, token: string, sender: string | Address, target: string | Address, currency: string | CurrencyID);
    toHintedObject(): FactJson;
}
