import { HINT } from "../../alias";
import { Hint } from "../../common";
import { Config } from "../../node";
import { Address } from "../../key";
import { Assert, ECODE, MitumError } from "../../error";
import { SortFunc, hasOverlappingAddress } from "../../utils";
import { Bool } from "../../types";
export class Whitelist {
    hint;
    active;
    accounts;
    constructor(active, accounts) {
        this.hint = new Hint(HINT.DAO.WHITELIST);
        this.active = Bool.from(active);
        this.accounts = accounts ? accounts.map(a => Address.from(a)) : [];
        Assert.check(Config.DAO.ADDRESS_IN_WHITELIST.satisfy(accounts.length), MitumError.detail(ECODE.DAO.INVALID_WHITELIST, "whitelist length out of range"));
        Assert.check(hasOverlappingAddress(accounts), MitumError.detail(ECODE.DAO.INVALID_WHITELIST, "duplicate account found in whitelist"));
    }
    toBuffer() {
        return Buffer.concat([
            this.active.toBuffer(),
            Buffer.concat(this.accounts.sort(SortFunc).map(a => a.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            active: this.active.v,
            accounts: this.accounts.sort(SortFunc).map(a => a.toString()),
        };
    }
}
//# sourceMappingURL=whitelist.js.map