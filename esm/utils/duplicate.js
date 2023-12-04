import { Address } from "../key";
export const hasOverlappingAddress = (arr) => (new Set(arr.map(a => a instanceof Address ? a.toString() : a)).size == arr.length);
//# sourceMappingURL=duplicate.js.map