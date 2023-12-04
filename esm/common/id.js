import { Config } from "../node";
import { Assert, ECODE, MitumError } from "../error";
class ID {
    s;
    constructor(s) {
        this.s = s;
    }
    equal(id) {
        return this.toString() === id.toString();
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}
export class CurrencyID extends ID {
    constructor(s) {
        super(s);
        Assert.check(Config.CURRENCY_ID.satisfy(s.length), MitumError.detail(ECODE.INVALID_CURRENCY_ID, "currency id length out of range"));
        Assert.check(/^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s), MitumError.detail(ECODE.INVALID_CURRENCY_ID, "invalid currency id format"));
    }
    static from(s) {
        return s instanceof CurrencyID ? s : new CurrencyID(s);
    }
}
export class ContractID extends ID {
    constructor(s) {
        super(s);
        Assert.check(Config.CONTRACT_ID.satisfy(s.length), MitumError.detail(ECODE.INVALID_CONTRACT_ID, "contract id length out of range"));
        Assert.check(/^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s), MitumError.detail(ECODE.INVALID_CONTRACT_ID, "invalid contract id format"));
    }
    static from(s) {
        return s instanceof ContractID ? s : new ContractID(s);
    }
}
//# sourceMappingURL=id.js.map