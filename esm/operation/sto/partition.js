import { Config } from "../../node";
import { Assert, ECODE, MitumError } from "../../error";
export class Partition {
    s;
    constructor(s) {
        Assert.check(Config.STO.PARTITION.satisfy(s.length), MitumError.detail(ECODE.STO.INVALID_PARTITION, "partition length out of range"));
        Assert.check(/^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s), MitumError.detail(ECODE.STO.INVALID_PARTITION, "invalid partition format"));
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
//# sourceMappingURL=partition.js.map