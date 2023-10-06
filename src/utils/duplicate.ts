import { Address } from "../key";

export const hasOverlappingAddress = (arr: (string | Address)[]) => (
    new Set(arr.map(a => a instanceof Address ? a.toString() : a)).size == arr.length
)