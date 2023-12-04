"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hint = void 0;
const node_1 = require("../node");
class Hint {
    constructor(s) {
        this.s = s;
    }
    toString() {
        return `${this.s}-${node_1.Version.get()}`;
    }
}
exports.Hint = Hint;
//# sourceMappingURL=hint.js.map