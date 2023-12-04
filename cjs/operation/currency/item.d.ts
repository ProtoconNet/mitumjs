import { Item } from "../base";
import { Amount } from "../../common";
import { AddressType } from "../../key";
import { HintedObject } from "../../types";
export declare abstract class CurrencyItem extends Item {
    readonly amounts: Amount[];
    readonly addressType: AddressType | "";
    protected constructor(hint: string, amounts: Amount[], addressType?: AddressType);
    toHintedObject(): HintedObject;
}
