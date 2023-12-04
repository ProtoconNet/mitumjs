"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppendFact = void 0;
const fact_1 = require("./fact");
const types_1 = require("../../types");
const alias_1 = require("../../alias");
const node_1 = require("../../node");
const error_1 = require("../../error");
class AppendFact extends fact_1.TimeStampFact {
    constructor(token, sender, target, projectID, requestTimeStamp, data, currency) {
        super(alias_1.HINT.TIMESTAMP.APPEND.FACT, token, sender, target, currency);
        this.projectID = projectID;
        this.requestTimeStamp = types_1.Big.from(requestTimeStamp);
        this.data = data;
        error_1.Assert.check(node_1.Config.TIMESTAMP.PROJECT_ID.satisfy(this.projectID.length), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "project id length out of range"));
        error_1.Assert.check(node_1.Config.TIMESTAMP.DATA.satisfy(this.data.length), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "data length out of range"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.projectID),
            this.requestTimeStamp.toBuffer("fill"),
            Buffer.from(this.data),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { projectid: this.projectID, request_timestamp: this.requestTimeStamp.v, data: this.data });
    }
    get operationHint() {
        return alias_1.HINT.TIMESTAMP.APPEND.OPERATION;
    }
}
exports.AppendFact = AppendFact;
//# sourceMappingURL=append.js.map