import { Item } from "../base";
import { Config } from "../../node";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { Assert, ECODE, MitumError } from "../../error";
export class CredentialItem extends Item {
    contract;
    holder;
    templateID;
    id;
    currency;
    constructor(hint, contract, holder, templateID, id, currency) {
        super(hint);
        this.contract = Address.from(contract);
        this.holder = Address.from(holder);
        this.templateID = templateID;
        this.id = id;
        this.currency = CurrencyID.from(currency);
        Assert.check(Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length), MitumError.detail(ECODE.INVALID_ITEM, "template id length out of range"));
        Assert.check(Config.CREDENTIAL.ID.satisfy(id.length), MitumError.detail(ECODE.INVALID_ITEM, "credential id length out of range"));
        Assert.check(this.contract.toString() !== this.holder.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with holder address"));
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
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            holder: this.holder.toString(),
            template_id: this.templateID,
            id: this.id,
            currency: this.currency.toString(),
        };
    }
    toString() {
        return this.contract.toString();
    }
}
//# sourceMappingURL=item.js.map