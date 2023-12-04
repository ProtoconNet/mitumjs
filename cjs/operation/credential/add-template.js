"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTemplateFact = void 0;
const base_1 = require("../base");
const alias_1 = require("../../alias");
const node_1 = require("../../node");
const key_1 = require("../../key");
const types_1 = require("../../types");
const error_1 = require("../../error");
class AddTemplateFact extends base_1.ContractFact {
    constructor(token, sender, contract, templateID, templateName, serviceDate, expirationDate, templateShare, multiAudit, displayName, subjectKey, description, creator, currency) {
        super(alias_1.HINT.CREDENTIAL.ADD_TEMPLATE.FACT, token, sender, contract, currency);
        this.templateID = templateID;
        this.templateName = templateName;
        this.serviceDate = types_1.ShortDate.from(serviceDate);
        this.expirationDate = types_1.ShortDate.from(expirationDate);
        this.templateShare = types_1.Bool.from(templateShare);
        this.multiAudit = types_1.Bool.from(multiAudit);
        this.displayName = displayName;
        this.subjectKey = subjectKey;
        this.description = description;
        this.creator = key_1.Address.from(creator);
        error_1.Assert.check(node_1.Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "template id length out of range"));
        error_1.Assert.check(node_1.Config.CREDENTIAL.TEMPLATE_NAME.satisfy(templateName.length), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "template name length out of range"));
        error_1.Assert.check(node_1.Config.CREDENTIAL.DISPLAY_NAME.satisfy(displayName.length), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "display name length out of range"));
        error_1.Assert.check(node_1.Config.CREDENTIAL.SUBJECT_KEY.satisfy(subjectKey.length), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "subject key length out of range"));
        error_1.Assert.check(node_1.Config.CREDENTIAL.DESCRIPTION.satisfy(description.length), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "description length out of range"));
        error_1.Assert.check(Date.parse(serviceDate.toString()) <= Date.parse(expirationDate.toString()), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "expire date < service date"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.templateID),
            Buffer.from(this.templateName),
            this.serviceDate.toBuffer(),
            this.expirationDate.toBuffer(),
            this.templateShare.toBuffer(),
            this.multiAudit.toBuffer(),
            Buffer.from(this.displayName),
            Buffer.from(this.subjectKey),
            Buffer.from(this.description),
            this.creator.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { template_id: this.templateID, template_name: this.templateName, service_date: this.serviceDate.toString(), expiration_date: this.expirationDate.toString(), template_share: this.templateShare.v, multi_audit: this.multiAudit.v, display_name: this.displayName, subject_key: this.subjectKey, description: this.description, creator: this.creator.toString() });
    }
    get operationHint() {
        return alias_1.HINT.CREDENTIAL.ADD_TEMPLATE.OPERATION;
    }
}
exports.AddTemplateFact = AddTemplateFact;
//# sourceMappingURL=add-template.js.map