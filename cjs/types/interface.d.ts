/// <reference types="node" />
import { HintedObject } from "./hinted";
export interface IBuffer {
    toBuffer(): Buffer;
}
export interface IHintedObject {
    toHintedObject(): HintedObject;
}
export interface IString {
    toString(): string;
}
