import { OperationFact } from "../base";
import { CredentialItem } from "./item";
import { HINT } from "../../alias";
import { Config } from "../../node";
import { Assert, ECODE, MitumError } from "../../error";
import { Big } from "../../types";
export class AssignItem extends CredentialItem {
    value;
    validFrom;
    validUntil;
    did;
    constructor(contract, holder, templateID, id, value, validFrom, validUntil, did, currency) {
        super(HINT.CREDENTIAL.ASSIGN.ITEM, contract, holder, templateID, id, currency);
        this.value = value;
        this.validFrom = Big.from(validFrom);
        this.validUntil = Big.from(validUntil);
        this.did = did;
        Assert.check(Config.CREDENTIAL.VALUE.satisfy(value.length), MitumError.detail(ECODE.INVALID_ITEM, "credential value length out of range"));
        Assert.check(validFrom < validUntil, MitumError.detail(ECODE.INVALID_ITEM, "valid until <= valid from"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.value),
            this.validFrom.toBuffer("fill"),
            this.validUntil.toBuffer("fill"),
            Buffer.from(this.did),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            value: this.value,
            valid_from: this.validFrom.v,
            valid_until: this.validUntil.v,
            did: this.did,
        };
    }
    toString() {
        return `${super.toString()}-${this.id}`;
    }
}
export class AssignFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CREDENTIAL.ASSIGN.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate credential id found in items"));
    }
    get operationHint() {
        return HINT.CREDENTIAL.ASSIGN.OPERATION;
    }
}
//# sourceMappingURL=assign.js.map