"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whitelist = void 0;
const alias_1 = require("../../alias");
const common_1 = require("../../common");
const node_1 = require("../../node");
const key_1 = require("../../key");
const error_1 = require("../../error");
const utils_1 = require("../../utils");
const types_1 = require("../../types");
class Whitelist {
    constructor(active, accounts) {
        this.hint = new common_1.Hint(alias_1.HINT.DAO.WHITELIST);
        this.active = types_1.Bool.from(active);
        this.accounts = accounts ? accounts.map(a => key_1.Address.from(a)) : [];
        error_1.Assert.check(node_1.Config.DAO.ADDRESS_IN_WHITELIST.satisfy(accounts.length), error_1.MitumError.detail(error_1.ECODE.DAO.INVALID_WHITELIST, "whitelist length out of range"));
        error_1.Assert.check((0, utils_1.hasOverlappingAddress)(accounts), error_1.MitumError.detail(error_1.ECODE.DAO.INVALID_WHITELIST, "duplicate account found in whitelist"));
    }
    toBuffer() {
        return Buffer.concat([
            this.active.toBuffer(),
            Buffer.concat(this.accounts.sort(utils_1.SortFunc).map(a => a.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            active: this.active.v,
            accounts: this.accounts.sort(utils_1.SortFunc).map(a => a.toString()),
        };
    }
}
exports.Whitelist = Whitelist;
//# sourceMappingURL=whitelist.js.map