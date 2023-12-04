import { OperationFact } from "../base";
import { CredentialItem } from "./item";
import { HINT } from "../../alias";
import { Assert, ECODE, MitumError } from "../../error";
export class RevokeItem extends CredentialItem {
    constructor(contract, holder, templateID, id, currency) {
        super(HINT.CREDENTIAL.REVOKE.ITEM, contract, holder, templateID, id, currency);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toString() {
        return `${super.toString()}-${this.id}`;
    }
}
export class RevokeFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CREDENTIAL.REVOKE.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate credential id found in items"));
    }
    get operationHint() {
        return HINT.CREDENTIAL.REVOKE.OPERATION;
    }
}
//# sourceMappingURL=revoke.js.map