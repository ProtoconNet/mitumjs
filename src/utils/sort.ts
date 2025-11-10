import { IBuffer } from "../types"
import { Buffer } from "buffer";

export const SortFunc = <T extends IBuffer, U extends IBuffer>(a: T, b: U) =>
    Buffer.compare(a.toBuffer(), b.toBuffer())