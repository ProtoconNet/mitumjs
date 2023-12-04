"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialItem = void 0;
const base_1 = require("../base");
const node_1 = require("../../node");
const key_1 = require("../../key");
const common_1 = require("../../common");
const error_1 = require("../../error");
class CredentialItem extends base_1.Item {
    constructor(hint, contract, holder, templateID, id, currency) {
        super(hint);
        this.contract = key_1.Address.from(contract);
        this.holder = key_1.Address.from(holder);
        this.templateID = templateID;
        this.id = id;
        this.currency = common_1.CurrencyID.from(currency);
        error_1.Assert.check(node_1.Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "template id length out of range"));
        error_1.Assert.check(node_1.Config.CREDENTIAL.ID.satisfy(id.length), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "credential id length out of range"));
        error_1.Assert.check(this.contract.toString() !== this.holder.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_ITEM, "contract is same with holder address"));
    }
    toBuffer() {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.holder.toBuffer(),
            Buffer.from(this.templateID),
            Buffer.from(this.id),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { contract: this.contract.toString(), holder: this.holder.toString(), template_id: this.templateID, id: this.id, currency: this.currency.toString() });
    }
    toString() {
        return this.contract.toString();
    }
}
exports.CredentialItem = CredentialItem;
//# sourceMappingURL=item.js.map