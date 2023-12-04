"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOverlappingAddress = void 0;
const key_1 = require("../key");
const hasOverlappingAddress = (arr) => (new Set(arr.map(a => a instanceof key_1.Address ? a.toString() : a)).size == arr.length);
exports.hasOverlappingAddress = hasOverlappingAddress;
//# sourceMappingURL=duplicate.js.map