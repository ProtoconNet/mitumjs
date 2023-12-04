"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Partition = void 0;
const node_1 = require("../../node");
const error_1 = require("../../error");
class Partition {
    constructor(s) {
        error_1.Assert.check(node_1.Config.STO.PARTITION.satisfy(s.length), error_1.MitumError.detail(error_1.ECODE.STO.INVALID_PARTITION, "partition length out of range"));
        error_1.Assert.check(/^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s), error_1.MitumError.detail(error_1.ECODE.STO.INVALID_PARTITION, "invalid partition format"));
        this.s = s;
    }
    static from(s) {
        return s instanceof Partition ? s : new Partition(s);
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}
exports.Partition = Partition;
//# sourceMappingURL=partition.js.map